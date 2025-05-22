const express = require('express');
const router = express.Router();
const db = require('../db');

// Criar equipe
router.post('/', async (req, res) => {
  const { Nome_Equipe, Descricao } = req.body;
  if (!Nome_Equipe) {
    return res.status(400).json({ message: 'Nome da equipe é obrigatório' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO Equipe (Nome_Equipe, Descricao) VALUES (?, ?)',
      [Nome_Equipe, Descricao]
    );
    res.status(201).json({ message: 'Equipe criada', ID_Equipe: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar equipe', error: error.message });
  }
});

// Listar equipes
router.get('/', async (req, res) => {
  try {
    const [equipes] = await db.query('SELECT * FROM Equipe');
    res.json({ message: 'Equipes recuperadas', data: equipes });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar equipes', error: error.message });
  }
});

// Buscar uma equipe
router.get('/:id', async (req, res) => {
  try {
    const [equipes] = await db.query('SELECT * FROM Equipe WHERE ID_Equipe = ?', [req.params.id]);
    if (equipes.length === 0) {
      return res.status(404).json({ message: 'Equipe não encontrada' });
    }
    res.json({ message: 'Equipe recuperada', data: equipes[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar equipe', error: error.message });
  }
});

// Atualizar equipe
router.put('/:id', async (req, res) => {
  const { Nome_Equipe, Descricao } = req.body;
  if (!Nome_Equipe) {
    return res.status(400).json({ message: 'Nome da equipe é obrigatório' });
  }
  try {
    const [result] = await db.query(
      'UPDATE Equipe SET Nome_Equipe = ?, Descricao = ? WHERE ID_Equipe = ?',
      [Nome_Equipe, Descricao, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipe não encontrada' });
    }
    res.json({ message: 'Equipe atualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar equipe', error: error.message });
  }
});

// Excluir equipe
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Equipe WHERE ID_Equipe = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipe não encontrada' });
    }
    res.json({ message: 'Equipe excluída' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir equipe', error: error.message });
  }
});

module.exports = router;
