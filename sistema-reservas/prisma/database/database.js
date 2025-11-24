const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database('./database/reservaqui.db');

db.serialize(() => {
  // Tabela de usuários
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT,
    tipo TEXT DEFAULT 'usuario'
  )`);

  // Tabela de salas
  db.run(`CREATE TABLE IF NOT EXISTS salas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    capacidade INTEGER,
    descricao TEXT
  )`);

  // Tabela de reservas
  db.run(`CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    sala_id INTEGER,
    data TEXT,
    hora TEXT,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(sala_id) REFERENCES salas(id)
  )`);

  // Criar administrador padrão se não existir
  const adminEmail = 'admin@reservaqui.com';
  const adminSenha = bcrypt.hashSync('123', 10);
  const adminNome = 'Administrador';

  db.get('SELECT * FROM usuarios WHERE email = ?', [adminEmail], (err, row) => {
    if (!row) {
      db.run(
        'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
        [adminNome, adminEmail, adminSenha, 'admin'],
        () => console.log('Admin criado: admin@reservaqui.com / senha: 123')
      );
    }
  });
});

module.exports = db;
