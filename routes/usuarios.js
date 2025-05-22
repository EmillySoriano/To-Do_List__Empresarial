const express = require('express');
const router = express.Router();
const db = require('../db');

// Criar usuário
router.post('/', async (req, res) => {
  const { Nome_Primeiro, Nome_Sobrenome, Cargo, Data_Nascimento, Departamento_ID } = req.body;
  if (!Nome_Primeiro || !Nome_Sobrenome || !Departamento_ID) {
    return res.status(400).json({ message: 'Campos obrigatórios faltam' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO Usuario (Nome_Primeiro, Nome_Sobrenome, Cargo, Data_Nascimento, Departamento_ID) VALUES (?, ?, ?, ?, ?)',
      [Nome_Primeiro, Nome_Sobrenome, Cargo, Data_Nascimento, Departamento_ID]
    );
    res.status(201).json({ message: 'Usuário criado', ID_Usuario: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
});

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const [usuarios] = await db.query(`
      SELECT u.*, d.Nome_Departamento 
      FROM Usuario u
      LEFT JOIN Departamento d ON u.Departamento_ID = d.ID_Departamento
    `);
    res.json({ message: 'Usuários recuperados', data: usuarios });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar usuários', error: error.message });
  }
});

// Buscar um usuário
router.get('/:id', async (req, res) => {
  try {
    const [usuarios] = await db.query(`
      SELECT u.*, d.Nome_Departamento 
      FROM Usuario u
      LEFT JOIN Departamento d ON u.Departamento_ID = d.ID_Departamento
      WHERE u.ID_Usuario = ?
    `, [req.params.id]);

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Buscar acessos do usuário
    const [acessos] = await db.query(`
      SELECT ta.* FROM Tipo_Acesso ta
      INNER JOIN Usuario_Acesso ua ON ta.ID_Acesso = ua.ID_Acesso
      WHERE ua.ID_Usuario = ?
    `, [req.params.id]);

    // Buscar tarefas criadas pelo usuário
    const [tarefasCriadas] = await db.query(`
      SELECT * FROM Tarefa WHERE ID_Usuario_Criador = ?
    `, [req.params.id]);

    // Buscar tarefas atribuídas ao usuário
    const [tarefasAtribuidas] = await db.query(`
      SELECT * FROM Tarefa WHERE ID_Usuario_Responsavel = ?
    `, [req.params.id]);

    const usuario = usuarios[0];
    usuario.acessos = acessos;
    usuario.tarefasCriadas = tarefasCriadas;
    usuario.tarefasAtribuidas = tarefasAtribuidas;

    res.json({ message: 'Usuário recuperado', data: usuario });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
  const { Nome_Primeiro, Nome_Sobrenome, Cargo, Data_Nascimento, Departamento_ID } = req.body;
  if (!Nome_Primeiro || !Nome_Sobrenome || !Departamento_ID) {
    return res.status(400).json({ message: 'Nome e departamento são obrigatórios' });
  }
  try {
    // Verificar se o departamento existe
    const [departamento] = await db.query('SELECT ID_Departamento FROM Departamento WHERE ID_Departamento = ?', [Departamento_ID]);
    if (departamento.length === 0) {
      return res.status(400).json({ message: 'Departamento não encontrado' });
    }

    const [result] = await db.query(
      'UPDATE Usuario SET Nome_Primeiro = ?, Nome_Sobrenome = ?, Cargo = ?, Data_Nascimento = ?, Departamento_ID = ? WHERE ID_Usuario = ?',
      [Nome_Primeiro, Nome_Sobrenome, Cargo, Data_Nascimento, Departamento_ID, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário atualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
});

// Excluir usuário
router.delete('/:id', async (req, res) => {
  try {
    // Verificar se o usuário tem tarefas criadas ou atribuídas
    const [tarefas] = await db.query(
      'SELECT COUNT(*) as count FROM Tarefa WHERE ID_Usuario_Criador = ? OR ID_Usuario_Responsavel = ?',
      [req.params.id, req.params.id]
    );

    if (tarefas[0].count > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir um usuário que possui tarefas criadas ou atribuídas' 
      });
    }

    // Remover acessos do usuário
    await db.query('DELETE FROM Usuario_Acesso WHERE ID_Usuario = ?', [req.params.id]);

    // Excluir usuário
    const [result] = await db.query('DELETE FROM Usuario WHERE ID_Usuario = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json({ message: 'Usuário excluído' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir usuário', error: error.message });
  }
});

module.exports = router;