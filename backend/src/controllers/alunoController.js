const db = require("../config/db");

function cadastrarAluno(req, res) {
  const { nome, matricula } = req.body;
  const sql = "INSERT INTO alunos (nome, matricula) VALUES (?, ?)";
  db.run(sql, [nome, matricula], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Aluno cadastrado!", id: this.lastID });
  });
}

function listarAlunos(req, res) {
  db.all("SELECT * FROM alunos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

function getPontuacao(req, res) {
  const { id } = req.params;
  db.get("SELECT pontos FROM alunos WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Aluno não encontrado" });

    let classificacao = "Iniciante";
    const pontos = row.pontos || 0;
    if (pontos >= 6 && pontos <= 10) classificacao = "Regular";
    else if (pontos >= 11 && pontos <= 20) classificacao = "Ativo";
    else if (pontos > 20) classificacao = "Extremo";

    res.json({ id, pontos, classificacao });
  });
}


module.exports = { cadastrarAluno, listarAlunos, getPontuacao };
