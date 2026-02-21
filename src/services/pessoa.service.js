// A camada de serviço lida com a regra de negócio e interação direta com o Prisma
import prisma from "../config/prisma.js";

export const PessoaService = {
  // Realiza a inserção no banco de dados usando o Prisma Client
  async createPessoa(data) {

    const pessoa = await prisma.pessoa.create({ data });
    return pessoa;
  },

  // Realiza a consulta para buscar todos os registros na tabela de pessoas
  async getPessoas() {
    const pessoas = await prisma.pessoa.findMany();
    return pessoas;
  },
};
