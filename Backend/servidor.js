const express = require('express');
const cors = require('cors');
require('dotenv').config();

const conexion = require('./conexion');
const rutasAuthUsuarios = require('./Rutas/autenyUsuarios');

const app = express();
const puerto = process.env.PUERTO || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/salud', async (_req, res) => {
  try {
    await conexion.query('SELECT 1');
    res.json({ ok: true, mensaje: 'Servidor y MySQL conectados' });
  } catch (error) {
    console.error('Detalle MySQL:', error.code, error.message);
    res.status(500).json({
      ok: false,
      mensaje: 'Error conectando a MySQL',
      codigo: error.code,
      detalle: error.message,
    });
  }
});

app.use('/api', rutasAuthUsuarios);

app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});