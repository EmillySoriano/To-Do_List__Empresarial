const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/error-handler');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve arquivos estáticos da pasta atual

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

// Middleware de tratamento de erros (deve vir por último)
app.use(errorHandler);

app.get('/', (req, res) => res.json({ message: 'API To-Do List Empresarial' }));
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));