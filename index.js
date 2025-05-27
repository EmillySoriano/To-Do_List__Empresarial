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

// Rota principal
app.get('/', (req, res) => res.json({ message: 'API To-Do List Empresarial' }));

// Middleware de tratamento de erros (deve vir por último)
app.use(errorHandler);

// Função para encontrar uma porta disponível
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
};

// Iniciar servidor com porta flexível
const startServer = async () => {
  try {
    const port = await findAvailablePort(3000);
    app.listen(port, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${port}`);
      console.log(`Acesse: http://localhost:${port}`);
      console.log(`Ou pelo IP da rede: http://${getLocalIP()}:${port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
  }
};

// Função para obter IP local
const getLocalIP = () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  
  // Retorna o primeiro IP encontrado
  for (const name of Object.keys(results)) {
    if (results[name].length > 0) {
      return results[name][0];
    }
  }
  return 'localhost';
};

startServer();