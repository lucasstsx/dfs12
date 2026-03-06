import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = Router();

// Rota POST para autenticar uma pessoa e receber um token JWT
router.post('/login', AuthController.login);

export default router;
