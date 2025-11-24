const pool = require("../config/db");

//Ranking de leitores
async function rankingLeitores(req, res) {
  const sql = `
    SELECT 
      a.nome,
      COUNT(e.id) AS livros_lidos,
      CASE
        WHEN COUNT(e.id) <= 5 THEN 'Iniciante'
        WHEN COUNT(e.id) BETWEEN 6 AND 10 THEN 'Regular'
        WHEN COUNT(e.id) BETWEEN 11 AND 20 THEN 'Ativo'
        ELSE 'Extremo'
      END AS classificacao
    FROM alunos a
    LEFT JOIN emprestimos e 
      ON a.id = e.aluno_id
      AND e.data_retirada >= NOW() - INTERVAL '6 months'
    GROUP BY a.nome
    ORDER BY livros_lidos DESC;
  `;

  try {
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { rankingLeitores };
