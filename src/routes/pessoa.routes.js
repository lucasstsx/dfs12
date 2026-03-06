import { Router } from "express";
// Importação do controlador para lidar com a lógica das requisições
import { PessoaController } from "../controllers/pessoa.controller.js";
// Importação do middleware de autenticação JWT
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Rota POST para criar uma nova pessoa (cadastro aberto, sem autenticação)
router.post("/", PessoaController.create);
// Rota GET para listar todas as pessoas cadastradas
router.get("/", PessoaController.getAll);
// Rota GET para buscar uma pessoa por ID
router.get("/:id", PessoaController.getById);
// Rota PATCH para atualizar uma pessoa (exige autenticação — apenas o próprio usuário)
router.patch("/:id", authMiddleware, PessoaController.update);
// Rota DELETE para deletar uma pessoa (exige autenticação — apenas o próprio usuário)
router.delete("/:id", authMiddleware, PessoaController.delete);


export default router;
