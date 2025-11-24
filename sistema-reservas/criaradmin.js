const bcrypt = require('bcryptjs');
const prisma = require('./database/prisma');

async function criarAdmin() {
  try {
    const email = 'admin@reservaqui.com';
    const senha = '123';

    // Verifica se já existe
    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) {
      console.log('Já existe um admin com este e-mail.');
      process.exit(0);
    }

    // Criptografa a senha
    const senhaHash = bcrypt.hashSync(senha, 10);

    // Cria o usuário
    await prisma.usuario.create({
      data: {
        nome: 'Administrador',
        email,
        senha: senhaHash,
        tipo: 'admin',
      },
    });

    console.log('Admin criado com sucesso!');
    console.log('Email: admin@reservaqui.com');
    console.log('Senha: 123');
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

criarAdmin();
