const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurações básicas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'reservaqui2025',
  resave: false,
  saveUninitialized: true
}));

// Rotas
const authRoutes = require('./routes/auth');
const reservaRoutes = require('./routes/reservas');
const adminRoutes = require('./routes/admin');

app.use('/', authRoutes);
app.use('/reservas', reservaRoutes);
app.use('/admin', adminRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`ReservAqui rodando em http://localhost:${PORT}`);
});
