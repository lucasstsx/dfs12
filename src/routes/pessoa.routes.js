import { Router } from "express";
import { PessoaController } from "../controllers/pessoa.controller.js";

const router = Router();

router.post("/", PessoaController.createPessoa);
router.get("/", PessoaController.getPessoas);

export default router;
