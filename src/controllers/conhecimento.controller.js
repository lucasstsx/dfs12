import { ConhecimentoService } from "../services/conhecimento.service.js";
import { isValidUUID, CATEGORIAS_VALIDAS, NIVEIS_VALIDOS } from "../utils/validators.js";

export const ConhecimentoController = {

  // Lógica para criação de um novo conhecimento
  async create(req, res) {
    try {
      const { titulo, descricao, categoria, nivel, pessoaId } = req.body;


      // Verificacao simples de dados
      if (!titulo || !descricao || !categoria || !nivel || !pessoaId) {
        return res.status(400).json({ error: 'Dados incompletos. Titulo, descricao, categoria, nivel e pessoaId são obrigatórios.' });
      }

      // Valida o enum categoria
      if (!CATEGORIAS_VALIDAS.includes(categoria)) {
        return res.status(400).json({ error: `Categoria inválida. Valores aceitos: ${CATEGORIAS_VALIDAS.join(', ')}` });
      }

      // Valida o enum nivel
      if (!NIVEIS_VALIDOS.includes(nivel)) {
        return res.status(400).json({ error: `Nível inválido. Valores aceitos: ${NIVEIS_VALIDOS.join(', ')}` });
      }

      // Chama a camada de serviço para processar a criação
      const conhecimento = await ConhecimentoService.create({
        titulo,
        descricao,
        categoria,
        nivel,
        pessoaId,
      });

      return res.status(201).json(conhecimento);
    } catch (error) {
      console.error(error);

      // P2003: violação de FK — pessoaId não existe no banco
      if (error.code === 'P2003') {
        return res.status(404).json({ error: 'Pessoa não encontrada' });
      }

      return res.status(500).json({ error: 'Erro interno ao criar conhecimento' });
    }
  },

  // Lógica para buscar a lista paginada de conhecimentos com filtros opcionais
  async getAll(req, res) {
    try {
      // Garante que os parâmetros de paginação sejam números inteiros positivos
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);

      const { categoria, nivel, busca } = req.query;

      // Valida o enum categoria, se fornecido
      if (categoria && !CATEGORIAS_VALIDAS.includes(categoria)) {
        return res.status(400).json({ error: `Categoria inválida. Valores aceitos: ${CATEGORIAS_VALIDAS.join(', ')}` });
      }

      // Valida o enum nivel, se fornecido
      if (nivel && !NIVEIS_VALIDOS.includes(nivel)) {
        return res.status(400).json({ error: `Nível inválido. Valores aceitos: ${NIVEIS_VALIDOS.join(', ')}` });
      }

      const conhecimentos = await ConhecimentoService.getAll(page, limit, categoria, nivel, busca);
      return res.status(200).json(conhecimentos);
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: 'Erro interno ao buscar conhecimentos' });
    }
  },

  // Lógica para buscar um conhecimento específico por ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      // Verifica se o ID é um UUID v4 válido
      if (!isValidUUID(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const conhecimento = await ConhecimentoService.getById(id);

      if (!conhecimento) {
        return res.status(404).json({ error: 'Conhecimento não encontrado' });
      }

      return res.status(200).json(conhecimento);
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: 'Erro interno ao buscar conhecimento' });
    }
  },

  // Lógica para atualizar um conhecimento específico por ID
  async update(req, res) {
    try {
      const { id } = req.params;

      // Verifica se o ID é um UUID v4 válido
      if (!isValidUUID(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      // Valida os enums se foram fornecidos no body
      const { categoria, nivel } = req.body;
      if (categoria && !CATEGORIAS_VALIDAS.includes(categoria)) {
        return res.status(400).json({ error: `Categoria inválida. Valores aceitos: ${CATEGORIAS_VALIDAS.join(', ')}` });
      }
      if (nivel && !NIVEIS_VALIDOS.includes(nivel)) {
        return res.status(400).json({ error: `Nível inválido. Valores aceitos: ${NIVEIS_VALIDOS.join(', ')}` });
      }

      // Verifica se o conhecimento existe e pertence à pessoa autenticada
      const existente = await ConhecimentoService.getById(id);
      if (!existente) {
        return res.status(404).json({ error: 'Conhecimento não encontrado' });
      }
      if (existente.pessoaId !== req.pessoaId && !req.isAdmin) {
        return res.status(403).json({ error: 'Sem permissão para modificar este conhecimento' });
      }

      // tenta atualizar
      const conhecimento = await ConhecimentoService.update(id, req.body);

      return res.status(200).json(conhecimento);
    } catch (error) {
      console.error(error);

      // No Prisma, o erro de "registro nao encontrado" é o P2025 então:
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Conhecimento não encontrado para atualização' });
      }

      return res.status(500).json({ error: 'Erro interno ao atualizar conhecimento' });
    }
  },

  // Lógica para deletar um conhecimento específico por ID
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Verifica se o ID é um UUID v4 válido
      if (!isValidUUID(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      // Verifica se o conhecimento existe e pertence à pessoa autenticada
      const existente = await ConhecimentoService.getById(id);
      if (!existente) {
        return res.status(404).json({ error: 'Conhecimento não encontrado' });
      }
      if (existente.pessoaId !== req.pessoaId && !req.isAdmin) {
        return res.status(403).json({ error: 'Sem permissão para excluir este conhecimento' });
      }


      await ConhecimentoService.delete(id);

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      // No Prisma, o erro de "registro nao encontrado" é o P2025 então:
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Conhecimento não encontrado para exclusão' });
      }

      return res.status(500).json({ error: 'Erro interno ao deletar conhecimento' });
    }
  }
}
