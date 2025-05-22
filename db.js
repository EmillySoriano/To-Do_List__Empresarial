const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Testar conexão
db.query('SELECT 1')
  .then(() => console.log('Conexão com MySQL bem-sucedida'))
  .catch(err => console.error('Erro na conexão:', err));

module.exports = db;