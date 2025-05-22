// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Erros do MySQL
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        return res.status(400).json({
          message: 'Registro duplicado',
          error: err.message
        });
      case 'ER_NO_REFERENCED_ROW':
      case 'ER_NO_REFERENCED_ROW_2':
        return res.status(400).json({
          message: 'Referência inválida',
          error: err.message
        });
      case 'ER_ROW_IS_REFERENCED':
      case 'ER_ROW_IS_REFERENCED_2':
        return res.status(400).json({
          message: 'Não é possível excluir este registro pois ele está sendo referenciado',
          error: err.message
        });
    }
  }

  // Erro de validação personalizado
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Erro de validação',
      error: err.message
    });
  }

  // Erro padrão
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: err.message
  });
};

// Classe de erro personalizada para validações
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

module.exports = {
  errorHandler,
  ValidationError
};
