const express = require("express");
const router = express.Router();
const relatorioController = require("../controllers/relatorioController");

router.get("/classificacao", relatorioController.rankingLeitores);

module.exports = router;
