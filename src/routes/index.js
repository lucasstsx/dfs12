import { Router } from 'express';

const router = Router();

// Rota de Health Check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// aqui a gente define as rotas, importando de outros arquivos para melhor organização, exemplo:
// router.use('/pessoas', pessoasRoutes);

export default router;