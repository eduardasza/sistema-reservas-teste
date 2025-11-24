const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/database/prisma');

// Login
router.get('/', (req, res) => {
  res.render('login', { erro: null });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.render('login', { erro: 'Usuário não encontrado' });

    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaCorreta) return res.render('login', { erro: 'Senha incorreta' });

    req.session.usuario = usuario;
    if (usuario.tipo === 'admin') return res.redirect('/admin/salas');
    else return res.redirect('/reservas');
  } catch (err) {
    console.error(err);
    res.render('login', { erro: 'Erro ao fazer login.' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
