import { Router } from "express";
// Importação do controlador para lidar com a lógica das requisições
import { PessoaController } from "../controllers/pessoa.controller.js";

const router = Router();

// Rota POST para criar uma nova pessoa
router.post("/", PessoaController.createPessoa);
// Rota GET para listar todas as pessoas cadastradas
router.get("/", PessoaController.getPessoas);
// Rota GET para buscar uma pessoa por ID
router.get("/:id", PessoaController.getPessoaById);
// Rota PUT para atualizar uma pessoa
router.patch("/:id", PessoaController.updatePessoa);
// Rota DELETE para deletar uma pessoa
router.delete("/:id", PessoaController.deletePessoa);


export default router;
