import prisma from '../src/config/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpa os dados existentes para evitar conflitos (opcional, remova se quiser manter)
  await prisma.conhecimento.deleteMany();
  await prisma.pessoa.deleteMany();

  const senhaPadrao = await bcrypt.hash('123456', 10);

  // Cria o admin primeiro para garantir que sempre exista um usuário com acesso total
  const admin = await prisma.pessoa.create({
    data: {
      nome: 'Administrador',
      email: 'admin@email.com',
      telefone: '11000000000',
      descricao: 'Usuário administrador padrão do sistema.',
      senha: senhaPadrao,
      isAdmin: true
    }
  });

  // Criando usuários comuns (sem ser admin)
  const pessoa1 = await prisma.pessoa.create({
    data: {
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '11999999999',
      descricao: 'Desenvolvedor entusiasta de novas tecnologias.',
      senha: senhaPadrao,
      isAdmin: false,
      conhecimentos: {
        create: [
          {
            titulo: 'JavaScript Avançado',
            descricao: 'Conhecimentos em Node.js, React e ecossistema moderno.',
            categoria: 'TECNOLOGIA',
            nivel: 'AVANCADO'
          },
          {
            titulo: 'Lógica de Programação',
            descricao: 'Base sólida em algoritmos e estruturas de dados.',
            categoria: 'TECNOLOGIA',
            nivel: 'INTERMEDIARIO'
          }
        ]
      }
    }
  });

  const pessoa2 = await prisma.pessoa.create({
    data: {
      nome: 'Maria Souza',
      email: 'maria@email.com',
      telefone: '11888888888',
      descricao: 'Professora de idiomas com foco em conversação.',
      senha: senhaPadrao,
      isAdmin: false,
      conhecimentos: {
        create: [
          {
            titulo: 'Inglês Fluente',
            descricao: 'Conversação avançada e escrita acadêmica.',
            categoria: 'IDIOMAS',
            nivel: 'AVANCADO'
          },
          {
            titulo: 'Francês para Iniciantes',
            descricao: 'Gramática básica e vocabulário cotidiano.',
            categoria: 'IDIOMAS',
            nivel: 'BASICO'
          }
        ]
      }
    }
  });

  const pessoa3 = await prisma.pessoa.create({
    data: {
      nome: 'Carlos Oliveira',
      email: 'carlos@email.com',
      telefone: '11777777777',
      descricao: 'Músico amador apaixonado por violão clássico.',
      senha: senhaPadrao,
      isAdmin: false,
      conhecimentos: {
        create: [
          {
            titulo: 'Violão Popular',
            descricao: 'Acordes básicos e ritmos brasileiros.',
            categoria: 'MUSICA',
            nivel: 'INTERMEDIARIO'
          }
        ]
      }
    }
  });

  console.log(`✅ Seed concluído! Criadas ${4} pessoas (incluindo 1 admin) e seus conhecimentos.`);
  console.log(`🔐 Admin criado: ${admin.email} (senha: 123456)`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
