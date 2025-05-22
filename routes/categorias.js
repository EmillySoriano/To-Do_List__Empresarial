const express = require('express');
const router = express.Router();
const db = require('../db');

// Criar categoria
router.post('/', async (req, res) => {
  const { Nome_Categoria, Descricao } = req.body;
  if (!Nome_Categoria) {
    return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO Categoria (Nome_Categoria, Descricao) VALUES (?, ?)',
      [Nome_Categoria, Descricao]
    );
    res.status(201).json({ message: 'Categoria criada', ID_Categoria: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar categoria', error: error.message });
  }
});

// Listar categorias
router.get('/', async (req, res) => {
  try {
    const [categorias] = await db.query('SELECT * FROM Categoria');
    res.json({ message: 'Categorias recuperadas', data: categorias });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar categorias', error: error.message });
  }
});

// Buscar uma categoria
router.get('/:id', async (req, res) => {
  try {
    const [categorias] = await db.query('SELECT * FROM Categoria WHERE ID_Categoria = ?', [req.params.id]);
    if (categorias.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.json({ message: 'Categoria recuperada', data: categorias[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar categoria', error: error.message });
  }
});

// Atualizar categoria
router.put('/:id', async (req, res) => {
  const { Nome_Categoria, Descricao } = req.body;
  if (!Nome_Categoria) {
    return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
  }
  try {
    const [result] = await db.query(
      'UPDATE Categoria SET Nome_Categoria = ?, Descricao = ? WHERE ID_Categoria = ?',
      [Nome_Categoria, Descricao, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.json({ message: 'Categoria atualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar categoria', error: error.message });
  }
});

// Excluir categoria
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM Categoria WHERE ID_Categoria = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.json({ message: 'Categoria excluída' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir categoria', error: error.message });
  }
});

module.exports = router;
