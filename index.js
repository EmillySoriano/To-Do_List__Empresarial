const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routers
const tarefasRouter = require('./routes/tarefas');
const usuariosRouter = require('./routes/usuarios');
const departamentoRouter = require('./routes/departamento');
const equipesRouter = require('./routes/equipes');
const categoriasRouter = require('./routes/categorias');
const tarefaCategoriaRouter = require('./routes/tarefa-categoria');
const usuarioAcessoRouter = require('./routes/usuario-acesso');

// Rotas principais
app.use('/departamentos', departamentoRouter);
app.use('/usuarios', usuariosRouter);
app.use('/tarefas', tarefasRouter);
app.use('/equipes', equipesRouter);
app.use('/categorias', categoriasRouter);

// Rotas de relacionamentos
app.use('/tarefa-categoria', tarefaCategoriaRouter);
app.use('/usuario-acesso', usuarioAcessoRouter);
app.get('/', (req, res) => res.json({ message: 'API To-Do List Empresarial' }));
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));