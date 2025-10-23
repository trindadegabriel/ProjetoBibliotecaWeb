const express = require("express");
const router = express.Router();
const emprestimoController = require("../controllers/emprestimoController");

router.post("/", emprestimoController.retirarLivro);
router.put("/:id/devolucao", emprestimoController.devolverLivro);
router.get("/todos", emprestimoController.listarTodosEmprestimos);
router.get("/:matricula", emprestimoController.listarEmprestimosPorAluno);



module.exports = router;
