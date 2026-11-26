const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const conexion = mysql.createPool({
  host: process.env.BD_HOST || 'localhost',
  port: Number(process.env.BD_PUERTO) || 3306,
  user: process.env.BD_USUARIO,
  password: process.env.BD_CONTRASENA,
  database: process.env.BD_NOMBRE,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = conexion;