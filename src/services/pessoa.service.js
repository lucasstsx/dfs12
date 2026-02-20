import prisma from "../PrismaClient.js";

export const PessoaService = {
  async createPessoa(data) {

    const pessoa = await prisma.pessoa.create({ data });
    return pessoa;
  },

  async getPessoas() {
    const pessoas = await prisma.pessoa.findMany();
    return pessoas;
  },
};
