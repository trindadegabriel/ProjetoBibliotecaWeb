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
  const { matricula } = req.params;

  // Conta a quantidade de livros devolvidos nos últimos 6 meses
  const query = `
    SELECT COUNT(*) AS pontos
    FROM emprestimos e
    JOIN alunos a ON e.aluno_id = a.id
    WHERE a.matricula = ?
      AND e.data_devolucao IS NOT NULL
      AND e.data_devolucao >= date('now', '-6 months')
  `;

  db.get(query, [matricula], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    const pontos = row.pontos || 0;

    let classificacao = "Iniciante";
    if (pontos >= 6 && pontos <= 10) classificacao = "Regular";
    else if (pontos >= 11 && pontos <= 20) classificacao = "Ativo";
    else if (pontos > 20) classificacao = "Extremo";

    res.json({ matricula, pontos, classificacao });
  });
}


module.exports = { cadastrarAluno, listarAlunos, getPontuacao };
