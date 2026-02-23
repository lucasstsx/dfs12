import { Router } from "express";
// Importação do controlador para lidar com a lógica das requisições
import { PessoaController } from "../controllers/pessoa.controller.js";

const router = Router();

// Rota POST para criar uma nova pessoa
router.post("/", PessoaController.create);
// Rota GET para listar todas as pessoas cadastradas
router.get("/", PessoaController.getAll);
// Rota GET para buscar uma pessoa por ID
router.get("/:id", PessoaController.getById);
// Rota PATCH para atualizar uma pessoa
router.patch("/:id", PessoaController.update);
// Rota DELETE para deletar uma pessoa
router.delete("/:id", PessoaController.delete);


export default router;
