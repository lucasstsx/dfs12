// O controlador recebe os dados da requisição HTTP e retorna a resposta
import { PessoaService } from "../services/pessoa.service.js";

export const PessoaController = {

  // Lógica para criação de uma nova pessoa
  async createPessoa(req, res) {
    try {
      const { nome, email, telefone } = req.body;
      // Verificação simples para garantir que os campos obrigatórios foram enviados
      if (!nome || !email || !telefone) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      // Chama a camada de serviço para processar a criação
      const pessoa = await PessoaService.createPessoa({ nome, email, telefone });
      return res.status(201).json(pessoa);
    } catch (error) {
      // Retorna erro genérico em caso de falha no servidor ou banco de dados
      return res.status(500).json({ error: 'Erro interno ao criar pessoa' });
    }
  },

  // Lógica para buscar a lista completa de pessoas
  async getPessoas(req, res) {
    try {
      const pessoas = await PessoaService.getPessoas();
      return res.status(200).json(pessoas);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao buscar pessoas' });
    }
  },

};

