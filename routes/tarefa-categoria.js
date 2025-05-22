const express = require('express');
const router = express.Router();
const db = require('../db');

// Associar uma categoria a uma tarefa
router.post('/', async (req, res) => {
  const { ID_Tarefa, ID_Categoria } = req.body;
  if (!ID_Tarefa || !ID_Categoria) {
    return res.status(400).json({ message: 'ID da tarefa e ID da categoria são obrigatórios' });
  }
  try {
    // Verificar se a tarefa existe
    const [tarefa] = await db.query('SELECT * FROM Tarefa WHERE ID_Tarefa = ?', [ID_Tarefa]);
    if (tarefa.length === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    // Verificar se a categoria existe
    const [categoria] = await db.query('SELECT * FROM Categoria WHERE ID_Categoria = ?', [ID_Categoria]);
    if (categoria.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    // Verificar se a associação já existe
    const [associacao] = await db.query(
      'SELECT * FROM Tarefa_Categoria WHERE ID_Tarefa = ? AND ID_Categoria = ?',
      [ID_Tarefa, ID_Categoria]
    );
    if (associacao.length > 0) {
      return res.status(400).json({ message: 'Esta categoria já está associada a esta tarefa' });
    }

    await db.query(
      'INSERT INTO Tarefa_Categoria (ID_Tarefa, ID_Categoria) VALUES (?, ?)',
      [ID_Tarefa, ID_Categoria]
    );
    res.status(201).json({ message: 'Categoria associada à tarefa com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao associar categoria à tarefa', error: error.message });
  }
});

// Listar categorias de uma tarefa
router.get('/tarefa/:id', async (req, res) => {
  try {
    const [categorias] = await db.query(
      `SELECT c.* FROM Categoria c 
       INNER JOIN Tarefa_Categoria tc ON c.ID_Categoria = tc.ID_Categoria 
       WHERE tc.ID_Tarefa = ?`,
      [req.params.id]
    );
    res.json({ message: 'Categorias da tarefa recuperadas', data: categorias });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar categorias da tarefa', error: error.message });
  }
});

// Remover uma categoria de uma tarefa
router.delete('/', async (req, res) => {
  const { ID_Tarefa, ID_Categoria } = req.body;
  if (!ID_Tarefa || !ID_Categoria) {
    return res.status(400).json({ message: 'ID da tarefa e ID da categoria são obrigatórios' });
  }
  try {
    const [result] = await db.query(
      'DELETE FROM Tarefa_Categoria WHERE ID_Tarefa = ? AND ID_Categoria = ?',
      [ID_Tarefa, ID_Categoria]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Associação não encontrada' });
    }
    res.json({ message: 'Categoria removida da tarefa com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover categoria da tarefa', error: error.message });
  }
});

module.exports = router;
