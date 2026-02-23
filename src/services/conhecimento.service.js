import prisma from "../config/prisma.js";


export const ConhecimentoService = {
  // Realiza a inserção no banco de dados usando o Prisma Client
  async create(data) {

    const conhecimento = await prisma.conhecimento.create({ data });
    return conhecimento;
  },

  // Realiza a consulta para buscar os registros na tabela de conhecimentos com paginação e filtros opcionais
  async getAll(page = 1, limit = 10, categoria, nivel, busca) {
    const skip = (page - 1) * limit;

    // Monta o where dinâmico: só inclui o campo se o valor foi fornecido
    const where = {};
    if (categoria) where.categoria = categoria;
    if (nivel) where.nivel = nivel;
    if (busca) {
      where.OR = [
        { titulo: { contains: busca, mode: 'insensitive' } },
        { descricao: { contains: busca, mode: 'insensitive' } },
      ];
    }

    // O $transaction garante que ambas as operações sejam executadas juntas, ou nenhuma delas
    const [conhecimentos, total] = await prisma.$transaction([
      prisma.conhecimento.findMany({ where, skip, take: limit, orderBy: { criadoEm: 'desc' }, include: { pessoa: true } }),
      prisma.conhecimento.count({ where }),
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
    const conhecimento = await prisma.conhecimento.findUnique({ where: { id }, include: { pessoa: true } });
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
