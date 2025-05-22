const express = require('express');
const router = express.Router();
const db = require('../db');

// Criar departamento
router.post('/', async (req, res) => {
  const { Nome_Departamento, Descricao } = req.body;
  if (!Nome_Departamento) {
    return res.status(400).json({ message: 'Nome do departamento é obrigatório' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO Departamento (Nome_Departamento, Descricao) VALUES (?, ?)',
      [Nome_Departamento, Descricao]
    );
    res.status(201).json({ message: 'Departamento criado', ID_Departamento: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar departamento', error: error.message });
  }
});

// Listar departamentos
router.get('/', async (req, res) => {
  try {
    const [departamentos] = await db.query('SELECT * FROM Departamento');
    res.json({ message: 'Departamentos recuperados', data: departamentos });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar departamentos', error: error.message });
  }
});

// Buscar um departamento
router.get('/:id', async (req, res) => {
  try {
    const [departamentos] = await db.query('SELECT * FROM Departamento WHERE ID_Departamento = ?', [req.params.id]);
    if (departamentos.length === 0) {
      return res.status(404).json({ message: 'Departamento não encontrado' });
    }
    res.json({ message: 'Departamento recuperado', data: departamentos[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar departamento', error: error.message });
  }
});

// Atualizar departamento
router.put('/:id', async (req, res) => {
  const { Nome_Departamento, Descricao } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE Departamento SET Nome_Departamento = ?, Descricao = ? WHERE ID_Departamento = ?',
      [Nome_Departamento, Descricao, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Departamento não encontrado' });
    }
    res.json({ message: 'Departamento atualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar departamento', error: error.message });
  }
});

// Excluir departamento
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Departamento WHERE ID_Departamento = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Departamento não encontrado' });
    }
    res.json({ message: 'Departamento excluído' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir departamento', error: error.message });
  }
});

module.exports = router;