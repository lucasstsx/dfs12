// A camada de serviço lida com a regra de negócio e interação direta com o Prisma
import prisma from "../config/prisma.js";

export const PessoaService = {
  // Realiza a inserção no banco de dados usando o Prisma Client
  async createPessoa(data) {

    const pessoa = await prisma.pessoa.create({ data });
    return pessoa;
  },

  // Realiza a consulta para buscar os registros na tabela de pessoas com paginação
  async getPessoas(page = 1, limit = 10) {
    const skip = (page - 1) * limit;


    // O $transaction garante que ambas as operações sejam executadas juntas, ou nenhuma delas
    const [pessoas, total] = await prisma.$transaction([
      prisma.pessoa.findMany({ skip, take: limit }),
      prisma.pessoa.count(),
    ]);

    return {
      data: pessoas,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getPessoaById(id) {
    const pessoa = await prisma.pessoa.findUnique({ where: { id } });
    return pessoa;
  },

  async updatePessoa(id, data) {
    const pessoa = await prisma.pessoa.update({ where: { id }, data });
    return pessoa;
  },

  async deletePessoa(id) {
    const pessoa = await prisma.pessoa.delete({ where: { id } });
    return pessoa;
  },
};
