import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export const AuthService = {
  // Valida credenciais e retorna um JWT se forem válidas
  async login(email, senha) {
    // Busca a pessoa pelo email
    const pessoa = await prisma.pessoa.findUnique({ where: { email } });

    // Pessoa não encontrada ou senha incorreta — mesma mensagem para não vazar informação
    if (!pessoa) return null;

    const senhaValida = await bcrypt.compare(senha, pessoa.senha);
    if (!senhaValida) return null;

    // Gera o token JWT com id e email no payload, expirando em 7 dias
    const token = jwt.sign(
      { id: pessoa.id, email: pessoa.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return token;
  },
};
