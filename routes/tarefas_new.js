const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateDate, validateIdParam } = require('../middleware/validate');
const { ValidationError } = require('../middleware/error-handler');

// Criar tarefa
router.post('/', async (req, res, next) => {
  const { Titulo, Descricao, Data_Prazo, Criador, Responsavel, Prioridade, Categoria, Status } = req.body;
  
  try {
    // Validações
    if (!Titulo) {
      throw new ValidationError('Título é obrigatório');
    }
    
    if (Data_Prazo && !validateDate(Data_Prazo)) {
      throw new ValidationError('Data de prazo inválida');
    }

    // Garantir que existe o departamento padrão
    const [depts] = await db.query('SELECT COUNT(*) as count FROM departamento');
    if (depts[0].count === 0) {
      await db.query(`
        INSERT INTO departamento (Nome_Departamento, Descricao) 
        VALUES ('TI', 'Departamento de Tecnologia da Informação')
      `);
    }

    // Garantir que existe pelo menos um usuário padrão
    const [users] = await db.query('SELECT COUNT(*) as count FROM usuario');
    if (users[0].count === 0) {
      await db.query(`
        INSERT INTO usuario (Nome_Primeiro, Nome_Sobrenome, Cargo, Data_Nascimento, Departamento_ID) 
        VALUES ('Sistema', 'Padrão', 'Administrador', '1990-01-01', 1)
      `);
    }

    // Adicionar colunas extras na tabela se não existirem
    try {
      await db.query(`
        ALTER TABLE tarefa 
        ADD COLUMN Criador VARCHAR(100),
        ADD COLUMN Responsavel VARCHAR(100),
        ADD COLUMN Prioridade ENUM('Baixa','Média','Alta') DEFAULT 'Média',
        ADD COLUMN Status VARCHAR(50) DEFAULT 'Pendente',
        ADD COLUMN Categoria VARCHAR(100)
      `);
    } catch (alterError) {
      // Ignora erros se as colunas já existirem
      console.log('Colunas já existem ou erro ao adicionar:', alterError.message);
    }

    const [result] = await db.query(`
      INSERT INTO tarefa (Titulo, Descricao, Data_Criacao, Data_Prazo, ID_Usuario_Criador, Criador, Responsavel, Prioridade, Status, Categoria) 
      VALUES (?, ?, CURDATE(), ?, 1, ?, ?, ?, ?, ?)
    `, [Titulo, Descricao, Data_Prazo, Criador, Responsavel, Prioridade || 'Média', Status || 'Pendente', Categoria]);

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
      SELECT * FROM tarefa ORDER BY Data_Criacao DESC
    `);

    res.json({ 
      message: 'Tarefas recuperadas com sucesso',
      tarefas: tarefas 
    });
  } catch (error) {
    next(error);
  }
});

// Buscar uma tarefa
router.get('/:id', validateIdParam, async (req, res, next) => {
  try {
    const [tarefas] = await db.query(`
      SELECT * FROM tarefa WHERE ID_Tarefa = ?
    `, [req.params.id]);

    if (tarefas.length === 0) {
      throw new ValidationError('Tarefa não encontrada');
    }

    res.json({ 
      message: 'Tarefa recuperada com sucesso',
      data: tarefas[0]
    });
  } catch (error) {
    next(error);
  }
});

// Atualizar tarefa
router.put('/:id', validateIdParam, async (req, res, next) => {
  const { Titulo, Descricao, Data_Prazo, Responsavel, Prioridade, Categoria } = req.body;
  
  try {
    // Verificar se a tarefa existe
    const [tarefa] = await db.query('SELECT ID_Tarefa FROM tarefa WHERE ID_Tarefa = ?', [req.params.id]);
    if (tarefa.length === 0) {
      throw new ValidationError('Tarefa não encontrada');
    }

    // Construir a query dinamicamente para incluir apenas campos fornecidos
    const campos = [];
    const valores = [];
    
    if (Titulo) {
      campos.push('Titulo = ?');
      valores.push(Titulo);
    }
    if (Descricao !== undefined) {
      campos.push('Descricao = ?');
      valores.push(Descricao);
    }
    if (Data_Prazo !== undefined) {
      if (Data_Prazo && !validateDate(Data_Prazo)) {
        throw new ValidationError('Data de prazo inválida');
      }
      campos.push('Data_Prazo = ?');
      valores.push(Data_Prazo);
    }
    if (Responsavel !== undefined) {
      campos.push('Responsavel = ?');
      valores.push(Responsavel);
    }
    if (Prioridade !== undefined) {
      campos.push('Prioridade = ?');
      valores.push(Prioridade);
    }
    if (Categoria !== undefined) {
      campos.push('Categoria = ?');
      valores.push(Categoria);
    }
    
    if (campos.length === 0) {
      throw new ValidationError('Nenhum campo para atualizar fornecido');
    }
    
    valores.push(req.params.id);
    
    await db.query(
      `UPDATE tarefa SET ${campos.join(', ')} WHERE ID_Tarefa = ?`,
      valores
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
    const [tarefa] = await db.query('SELECT ID_Tarefa FROM tarefa WHERE ID_Tarefa = ?', [req.params.id]);
    if (tarefa.length === 0) {
      throw new ValidationError('Tarefa não encontrada');
    }

    // Iniciar transação
    await db.query('START TRANSACTION');

    try {
      // Remover associações com categorias (se existirem)
      await db.query('DELETE FROM tarefa_categoria WHERE ID_Tarefa = ?', [req.params.id]);
      
      // Remover a tarefa
      await db.query('DELETE FROM tarefa WHERE ID_Tarefa = ?', [req.params.id]);
      
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
