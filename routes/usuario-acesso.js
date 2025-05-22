const express = require('express');
const router = express.Router();
const db = require('../db');

// Adicionar acesso a um usuário
router.post('/', async (req, res) => {
  const { ID_Usuario, ID_Acesso } = req.body;
  if (!ID_Usuario || !ID_Acesso) {
    return res.status(400).json({ message: 'ID do usuário e ID do acesso são obrigatórios' });
  }
  try {
    // Verificar se o usuário existe
    const [usuario] = await db.query('SELECT * FROM Usuario WHERE ID_Usuario = ?', [ID_Usuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se o tipo de acesso existe
    const [acesso] = await db.query('SELECT * FROM Tipo_Acesso WHERE ID_Acesso = ?', [ID_Acesso]);
    if (acesso.length === 0) {
      return res.status(404).json({ message: 'Tipo de acesso não encontrado' });
    }

    // Verificar se a associação já existe
    const [associacao] = await db.query(
      'SELECT * FROM Usuario_Acesso WHERE ID_Usuario = ? AND ID_Acesso = ?',
      [ID_Usuario, ID_Acesso]
    );
    if (associacao.length > 0) {
      return res.status(400).json({ message: 'Este acesso já está associado a este usuário' });
    }

    await db.query(
      'INSERT INTO Usuario_Acesso (ID_Usuario, ID_Acesso) VALUES (?, ?)',
      [ID_Usuario, ID_Acesso]
    );
    res.status(201).json({ message: 'Acesso adicionado ao usuário com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar acesso ao usuário', error: error.message });
  }
});

// Listar acessos de um usuário
router.get('/usuario/:id', async (req, res) => {
  try {
    const [acessos] = await db.query(
      `SELECT ta.* FROM Tipo_Acesso ta 
       INNER JOIN Usuario_Acesso ua ON ta.ID_Acesso = ua.ID_Acesso 
       WHERE ua.ID_Usuario = ?`,
      [req.params.id]
    );
    res.json({ message: 'Acessos do usuário recuperados', data: acessos });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar acessos do usuário', error: error.message });
  }
});

// Remover acesso de um usuário
router.delete('/', async (req, res) => {
  const { ID_Usuario, ID_Acesso } = req.body;
  if (!ID_Usuario || !ID_Acesso) {
    return res.status(400).json({ message: 'ID do usuário e ID do acesso são obrigatórios' });
  }
  try {
    const [result] = await db.query(
      'DELETE FROM Usuario_Acesso WHERE ID_Usuario = ? AND ID_Acesso = ?',
      [ID_Usuario, ID_Acesso]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Associação não encontrada' });
    }
    res.json({ message: 'Acesso removido do usuário com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover acesso do usuário', error: error.message });
  }
});

module.exports = router;
