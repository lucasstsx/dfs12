// O controlador recebe os dados da requisição HTTP e retorna a resposta
import { PessoaService } from "../services/pessoa.service.js";
import { isValidUUID } from "../utils/validators.js";

export const PessoaController = {

  // Lógica para criação de uma nova pessoa
  async create(req, res) {
    try {

      const { nome, email, telefone, descricao } = req.body;
      // Verificação simples para garantir que os campos obrigatórios foram enviados
      if (!nome || !email || !telefone) {
        return res.status(400).json({ error: 'Dados incompletos. Nome, email e telefone são obrigatórios.' });
      }

      // Chama a camada de serviço para processar a criação
      const pessoa = await PessoaService.create({ nome, email, telefone, descricao });
      return res.status(201).json(pessoa);

    } catch (error) {
      console.error(error);

      // No Prisma, o erro de "registro único" é o P2002 então:
      if (error.code === 'P2002') return res.status(409).json({ error: 'E-mail já cadastrado' });

      return res.status(500).json({ error: 'Erro interno ao criar pessoa' });
    }
  },

  // Lógica para buscar a lista paginada de pessoas
  async getAll(req, res) {
    try {
      // Garante que os parâmetros de paginação sejam números inteiros positivos
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);

      const resultado = await PessoaService.getAll(page, limit);
      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: 'Erro interno ao buscar pessoas' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      // Verifica se o ID é um UUID v4 válido
      if (!isValidUUID(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const pessoa = await PessoaService.getById(id);

      if (!pessoa) {
        return res.status(404).json({ error: 'Pessoa não encontrada' });
      }

      return res.status(200).json(pessoa);

    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: 'Erro interno ao buscar pessoa' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      // Verifica se o ID é um UUID v4 válido
      if (!isValidUUID(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const { nome, email, telefone, descricao } = req.body;

      // Tenta atualizar
      const pessoa = await PessoaService.update(id, { nome, email, telefone, descricao });


      return res.status(200).json(pessoa);

    } catch (error) {
      console.error(error);

      // No Prisma, o erro de "registro nao encontrado" é o P2025 então:
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Pessoa não encontrada para atualização' });
      }

      return res.status(500).json({ error: 'Erro interno ao atualizar pessoa' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      // Verifica se o ID é um UUID v4 válido
      if (!isValidUUID(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      await PessoaService.delete(id);

      return res.status(204).send();

    } catch (error) {
      console.error(error);

      // No Prisma, o erro de "registro nao encontrado" é o P2025 então:
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Pessoa não encontrada para exclusão' });
      }

      return res.status(500).json({ error: 'Erro interno ao deletar pessoa' });
    }
  },

};
