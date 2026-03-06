import { Router } from "express";
import { ConhecimentoController } from "../controllers/conhecimento.controller.js";
// Importação do middleware de autenticação JWT
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Rota POST para criar um novo conhecimento (exige autenticação)
router.post("/", authMiddleware, ConhecimentoController.create);
// Rota GET para listar todos os conhecimentos cadastrados
router.get("/", ConhecimentoController.getAll);
// Rota GET para buscar um conhecimento específico por ID
router.get("/:id", ConhecimentoController.getById);
// Rota PATCH para atualizar um conhecimento específico por ID (exige autenticação)
router.patch("/:id", authMiddleware, ConhecimentoController.update);
// Rota DELETE para deletar um conhecimento específico por ID (exige autenticação)
router.delete("/:id", authMiddleware, ConhecimentoController.delete);

export default router;
