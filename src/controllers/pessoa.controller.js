import { PessoaService } from "../services/pessoa.service.js";

export const PessoaController = {

  async createPessoa(req, res) {
    try {
      const { nome, email, telefone } = req.body;
      if (!nome || !email || !telefone) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const pessoa = await PessoaService.createPessoa({ nome, email, telefone });
      return res.status(201).json(pessoa);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao criar pessoa' });
    }
  },

  async getPessoas(req, res) {
    try {
      const pessoas = await PessoaService.getPessoas();
      return res.status(200).json(pessoas);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao buscar pessoas' });
    }
  },

};

