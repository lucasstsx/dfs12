import { Router } from 'express';
// Importação das rotas específicas da entidade "pessoa"
import pessoasRoutes from './pessoa.routes.js';

const router = Router();

// Rota de Health Check para verificar se o servidor está ativo
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Agrupa as rotas de "pessoas" sob o caminho /pessoas
router.use('/pessoas', pessoasRoutes);

export default router;
