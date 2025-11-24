const pool = require("../config/db");

async function cadastrarAluno(req, res) {
  const { nome, matricula } = req.body;

  const sql = `
    INSERT INTO alunos (nome, matricula)
    VALUES ($1, $2)
    RETURNING id;
  `;

  try {
    const result = await pool.query(sql, [nome, matricula]);
    res.status(201).json({
      message: "Aluno cadastrado!",
      id: result.rows[0].id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listarAlunos(req, res) {
  try {
    const result = await pool.query("SELECT * FROM alunos");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPontuacao(req, res) {
  const { matricula } = req.params;

  const query = `
    SELECT COUNT(*) AS pontos
    FROM emprestimos e
    JOIN alunos a ON e.aluno_id = a.id
    WHERE a.matricula = $1
      AND e.data_devolucao IS NOT NULL
      AND e.data_devolucao >= NOW() - INTERVAL '6 months'
  `;

  try {
    const result = await pool.query(query, [matricula]);
    const pontos = parseInt(result.rows[0].pontos) || 0;

    let classificacao = "Iniciante";
    if (pontos >= 6 && pontos <= 10) classificacao = "Regular";
    else if (pontos >= 11 && pontos <= 20) classificacao = "Ativo";
    else if (pontos > 20) classificacao = "Extremo";

    res.json({ matricula, pontos, classificacao });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { cadastrarAluno, listarAlunos, getPontuacao };
