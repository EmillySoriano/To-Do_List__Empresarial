const db = require('../db');

// Validar se um departamento existe
exports.validateDepartamento = async (id) => {
  const [departamentos] = await db.query('SELECT ID_Departamento FROM Departamento WHERE ID_Departamento = ?', [id]);
  return departamentos.length > 0;
};

// Validar se um usuário existe
exports.validateUsuario = async (id) => {
  const [usuarios] = await db.query('SELECT ID_Usuario FROM Usuario WHERE ID_Usuario = ?', [id]);
  return usuarios.length > 0;
};

// Validar se uma equipe existe
exports.validateEquipe = async (id) => {
  const [equipes] = await db.query('SELECT ID_Equipe FROM Equipe WHERE ID_Equipe = ?', [id]);
  return equipes.length > 0;
};

// Validar se uma categoria existe
exports.validateCategoria = async (id) => {
  const [categorias] = await db.query('SELECT ID_Categoria FROM Categoria WHERE ID_Categoria = ?', [id]);
  return categorias.length > 0;
};

// Validar data no formato YYYY-MM-DD
exports.validateDate = (date) => {
  if (!date) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return false;
  
  return d.toISOString().slice(0, 10) === date;
};

// Middleware para validar IDs numéricos em parâmetros de rota
exports.validateIdParam = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: 'ID inválido' });
  }
  req.params.id = id;
  next();
};
