const express = require('express');
const router = express.Router();
const prisma = require('../prisma/database/prisma');

// Middleware de login
function verificarLogin(req, res, next) {
  if (!req.session.usuario) return res.redirect('/');
  next();
}

// Página principal de reservas
router.get('/', verificarLogin, async (req, res) => {
  const usuario = req.session.usuario;

  if (usuario.tipo === 'admin') {
    const reservas = await prisma.reserva.findMany({
      include: { usuario: true, sala: true }
    });
    res.render('admin-reservas', { usuario, reservas });
  } else {
    const salas = await prisma.sala.findMany();
    const reservas = await prisma.reserva.findMany({
      where: { usuario_id: usuario.id },
      include: { sala: true }
    });
    res.render('reservas', { usuario, salas, reservas });
  }
});

// Nova reserva
router.post('/nova', verificarLogin, async (req, res) => {
  const { sala_id, data, hora } = req.body;
  const usuario_id = req.session.usuario.id;

  await prisma.reserva.create({
    data: { usuario_id, sala_id: Number(sala_id), data, hora }
  });

  res.redirect('/reservas');
});

module.exports = router;
