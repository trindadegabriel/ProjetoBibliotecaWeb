const express = require("express");
const router = express.Router();
const livroController = require("../controllers/livroController");

router.post("/", livroController.cadastrarLivro);
router.get("/disponiveis", livroController.listarDisponiveis);

module.exports = router;
