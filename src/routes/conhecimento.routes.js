import { Router } from "express";
import { ConhecimentoController } from "../controllers/conhecimento.controller.js";

const router = Router();

// Rota POST para criar um novo conhecimento
router.post("/", ConhecimentoController.create);
// Rota GET para listar todos os conhecimentos cadastrados
router.get("/", ConhecimentoController.getAll);
// Rota GET para buscar um conhecimento específico por ID
router.get("/:id", ConhecimentoController.getById);
// Rota PATCH para atualizar um conhecimento específico por ID
router.patch("/:id", ConhecimentoController.update);
// Rota DELETE para deletar um conhecimento específico por ID
router.delete("/:id", ConhecimentoController.delete);

export default router;
