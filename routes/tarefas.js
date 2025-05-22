const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateUsuario, validateEquipe, validateDate, validateIdParam } = require('../middleware/validate');
const { ValidationError } = require('../middleware/error-handler');

// Criar tarefa
router.post('/', async (req, res, next) => {
  const { Titulo, Descricao, Data_Prazo, ID_Usuario_Criador, ID_Usuario_Responsavel, ID_Equipe } = req.body;
  
  try {
    // Validações
    if (!Titulo) {
      throw new ValidationError('Título é obrigatório');
    }
    if (!ID_Usuario_Criador) {
      throw new ValidationError('ID do criador é obrigatório');
    }
    if (Data_Prazo && !validateDate(Data_Prazo)) {
      throw new ValidationError('Data de prazo inválida');
    }
    
    // Verificar se o usuário criador existe
    if (!(await validateUsuario(ID_Usuario_Criador))) {
      throw new ValidationError('Usuário criador não encontrado');
    }
    
    // Verificar usuário responsável se fornecido
    if (ID_Usuario_Responsavel && !(await validateUsuario(ID_Usuario_Responsavel))) {
      throw new ValidationError('Usuário responsável não encontrado');
    }
    
    // Verificar equipe se fornecida
    if (ID_Equipe && !(await validateEquipe(ID_Equipe))) {
      throw new ValidationError('Equipe não encontrada');
    }

    const [result] = await db.query(
      'INSERT INTO Tarefa (Titulo, Descricao, Data_Criacao, Data_Prazo, ID_Usuario_Criador, ID_Usuario_Responsavel, ID_Equipe) VALUES (?, ?, CURDATE(), ?, ?, ?, ?)',
      [Titulo, Descricao, Data_Prazo, ID_Usuario_Criador, ID_Usuario_Responsavel, ID_Equipe]
    );

    res.status(201).json({ 
      message: 'Tarefa criada com sucesso',
      data: { ID_Tarefa: result.insertId }
    });
  } catch (error) {
    next(error);
  }
});

// Listar todas as tarefas
router.get('/', async (req, res, next) => {
  try {
    const [tarefas] = await db.query(`
      SELECT t.*, 
             CONCAT(u1.Nome_Primeiro, ' ', u1.Nome_Sobrenome) as Nome_Criador,
             CONCAT(u2.Nome_Primeiro, ' ', u2.Nome_Sobrenome) as Nome_Responsavel,
             e.Nome_Equipe,
             d.Nome_Departamento
      FROM Tarefa t
      LEFT JOIN Usuario u1 ON t.ID_Usuario_Criador = u1.ID_Usuario
      LEFT JOIN Usuario u2 ON t.ID_Usuario_Responsavel = u2.ID_Usuario
      LEFT JOIN Equipe e ON t.ID_Equipe = e.ID_Equipe
      LEFT JOIN Usuario u3 ON t.ID_Usuario_Responsavel = u3.ID_Usuario
      LEFT JOIN Departamento d ON u3.Departamento_ID = d.ID_Departamento
      ORDER BY t.Data_Criacao DESC
    `);

    res.json({ 
      message: 'Tarefas recuperadas com sucesso',
      data: tarefas 
    });
  } catch (error) {
    next(error);
  }
});

// Buscar uma tarefa
router.get('/:id', validateIdParam, async (req, res, next) => {
  try {
    const [tarefas] = await db.query(`
      SELECT t.*, 
             CONCAT(u1.Nome_Primeiro, ' ', u1.Nome_Sobrenome) as Nome_Criador,
             CONCAT(u2.Nome_Primeiro, ' ', u2.Nome_Sobrenome) as Nome_Responsavel,
             e.Nome_Equipe,
             d.Nome_Departamento
      FROM Tarefa t
      LEFT JOIN Usuario u1 ON t.ID_Usuario_Criador = u1.ID_Usuario
      LEFT JOIN Usuario u2 ON t.ID_Usuario_Responsavel = u2.ID_Usuario
      LEFT JOIN Equipe e ON t.ID_Equipe = e.ID_Equipe
      LEFT JOIN Usuario u3 ON t.ID_Usuario_Responsavel = u3.ID_Usuario
      LEFT JOIN Departamento d ON u3.Departamento_ID = d.ID_Departamento
      WHERE t.ID_Tarefa = ?
    `, [req.params.id]);

    if (tarefas.length === 0) {
      throw new ValidationError('Tarefa não encontrada');
    }

    // Buscar categorias da tarefa
    const [categorias] = await db.query(`
      SELECT c.* FROM Categoria c
      INNER JOIN Tarefa_Categoria tc ON c.ID_Categoria = tc.ID_Categoria
      WHERE tc.ID_Tarefa = ?
    `, [req.params.id]);

    const tarefa = tarefas[0];
    tarefa.categorias = categorias;

    res.json({ 
      message: 'Tarefa recuperada com sucesso',
      data: tarefa
    });
  } catch (error) {
    next(error);
  }
});

// Atualizar tarefa
router.put('/:id', validateIdParam, async (req, res, next) => {
  const { Titulo, Descricao, Data_Prazo, ID_Usuario_Responsavel, ID_Equipe } = req.body;
  
  try {
    // Validações
    if (!Titulo) {
      throw new ValidationError('Título é obrigatório');
    }
    if (Data_Prazo && !validateDate(Data_Prazo)) {
      throw new ValidationError('Data de prazo inválida');
    }

    // Verificar se a tarefa existe
    const [tarefa] = await db.query('SELECT ID_Tarefa FROM Tarefa WHERE ID_Tarefa = ?', [req.params.id]);
    if (tarefa.length === 0) {
      throw new ValidationError('Tarefa não encontrada');
    }

    // Verificar usuário responsável se fornecido
    if (ID_Usuario_Responsavel && !(await validateUsuario(ID_Usuario_Responsavel))) {
      throw new ValidationError('Usuário responsável não encontrado');
    }

    // Verificar equipe se fornecida
    if (ID_Equipe && !(await validateEquipe(ID_Equipe))) {
      throw new ValidationError('Equipe não encontrada');
    }

    await db.query(
      'UPDATE Tarefa SET Titulo = ?, Descricao = ?, Data_Prazo = ?, ID_Usuario_Responsavel = ?, ID_Equipe = ? WHERE ID_Tarefa = ?',
      [Titulo, Descricao, Data_Prazo, ID_Usuario_Responsavel, ID_Equipe, req.params.id]
    );

    res.json({ message: 'Tarefa atualizada com sucesso' });
  } catch (error) {
    next(error);
  }
});

// Excluir tarefa
router.delete('/:id', validateIdParam, async (req, res, next) => {
  try {
    // Verificar se a tarefa existe
    const [tarefa] = await db.query('SELECT ID_Tarefa FROM Tarefa WHERE ID_Tarefa = ?', [req.params.id]);
    if (tarefa.length === 0) {
      throw new ValidationError('Tarefa não encontrada');
    }

    // Iniciar transação
    await db.query('START TRANSACTION');

    try {
      // Remover associações com categorias
      await db.query('DELETE FROM Tarefa_Categoria WHERE ID_Tarefa = ?', [req.params.id]);
      
      // Remover a tarefa
      await db.query('DELETE FROM Tarefa WHERE ID_Tarefa = ?', [req.params.id]);
      
      // Commit da transação
      await db.query('COMMIT');
      
      res.json({ message: 'Tarefa excluída com sucesso' });
    } catch (error) {
      // Rollback em caso de erro
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;