const express = require('express');
const router = express.Router();
const prisma = require('../prisma/database/prisma');
const bcrypt = require('bcryptjs');

function verificarAdmin(req, res, next) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'admin') return res.redirect('/login');
  next();
}

/* ===== ROTAS DE SALAS ===== */
router.get('/salas', verificarAdmin, async (req, res) => {
  const salas = await prisma.sala.findMany();
  res.render('admin-salas', { usuario: req.session.usuario, salas });
});

router.post('/salas/nova', verificarAdmin, async (req, res) => {
  const { nome, capacidade, descricao } = req.body;
  await prisma.sala.create({
    data: { nome, capacidade: Number(capacidade), descricao }
  });
  res.redirect('/admin/salas');
});

router.post('/salas/excluir/:id', verificarAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.sala.delete({ where: { id } });
  res.redirect('/admin/salas');
});

/* ===== ROTAS DE USUÁRIOS ===== */
router.get('/usuarios', verificarAdmin, async (req, res) => {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nome: true, email: true, tipo: true }
  });
  res.render('admin-usuarios', { usuario: req.session.usuario, usuarios });
});

router.post('/usuarios/nova', verificarAdmin, async (req, res) => {
  const { nome, email, senha } = req.body;
  const senhaHash = bcrypt.hashSync(senha, 10);
  await prisma.usuario.create({
    data: { nome, email, senha: senhaHash }
  });
  res.redirect('/admin/usuarios');
});

/* ===== ROTAS DE RESERVAS ===== */
router.get('/reservas', verificarAdmin, async (req, res) => {
  const reservas = await prisma.reserva.findMany({
    include: { usuario: true, sala: true }
  });
  res.render('admin-reservas', { usuario: req.session.usuario, reservas });
});

module.exports = router;
