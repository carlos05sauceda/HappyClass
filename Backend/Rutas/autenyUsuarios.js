// routes/autenticacionYUsuarios.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conexion = require('../conexion');
const { verificarToken, exigirRol } = require('../autenticacion');

const router = express.Router();

router.post('/autenticacion/iniciar-sesion', async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña requeridos' });
  }

  const [filas] = await conexion.query(
    'SELECT id, correo, contrasena_hash, rol, nombre_completo, codigo_identificacion, departamento, activo FROM usuarios WHERE correo = ?',
    [correo.trim().toLowerCase()]
  );

  const usuario = filas[0];
  if (!usuario || !usuario.activo) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }

  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
  if (!contrasenaValida) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { contrasena_hash, ...perfil } = usuario;
  return res.json({ token, usuario: perfil });
});

// Solo el admin puede crear nuevos usuarios
router.post('/usuarios', verificarToken, exigirRol('admin'), async (req, res) => {
  const { correo, contrasena, rol, nombre_completo, codigo_identificacion, departamento } = req.body;

  if (!correo || !contrasena || !rol || !nombre_completo) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  if (!['admin', 'docente', 'estudiante'].includes(rol)) {
    return res.status(400).json({ mensaje: 'Rol no válido' });
  }

  const contrasenaHash = await bcrypt.hash(contrasena, 10);

  try {
    const [resultado] = await conexion.query(
      `INSERT INTO usuarios (correo, contrasena_hash, rol, nombre_completo, codigo_identificacion, departamento)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        correo.trim().toLowerCase(),
        contrasenaHash,
        rol,
        nombre_completo,
        codigo_identificacion || null,
        departamento || null,
      ]
    );

    return res.status(201).json({
      id: resultado.insertId,
      correo: correo.trim().toLowerCase(),
      rol,
      nombre_completo,
      codigo_identificacion,
      departamento,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensaje: 'El correo o código ya existe' });
    }
    return res.status(500).json({ mensaje: 'Error al crear el usuario' });
  }
});

module.exports = router;