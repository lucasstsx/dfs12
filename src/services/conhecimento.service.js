import prisma from "../config/prisma.js";


export const ConhecimentoService = {
  // Realiza a inserção no banco de dados usando o Prisma Client
  async create(data) {

    const conhecimento = await prisma.conhecimento.create({ data });
    return conhecimento;
  },

  // Realiza a consulta para buscar os registros na tabela de conhecimentos com paginação
  async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // O $transaction garante que ambas as operações sejam executadas juntas, ou nenhuma delas
    const [conhecimentos, total] = await prisma.$transaction([
      prisma.conhecimento.findMany({ skip, take: limit }),
      prisma.conhecimento.count(),
    ]);

    return {
      data: conhecimentos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
    };
  },

  async getById(id) {
    const conhecimento = await prisma.conhecimento.findUnique({ where: { id } });
    return conhecimento;
  },

  async update(id, data) {
    const conhecimento = await prisma.conhecimento.update({ where: { id }, data });
    return conhecimento;
  },

  async delete(id) {
    const conhecimento = await prisma.conhecimento.delete({ where: { id } });
    return conhecimento;
  }
}
