const { getConnection } = require("../config/db");

async function rankingLeitores(req, res) {
  try {
    const conn = await getConnection();
    const result = await conn.execute(`
      SELECT a.nome,
             COUNT(e.id) AS livros_lidos,
             CASE 
               WHEN COUNT(e.id) <= 5 THEN 'Iniciante'
               WHEN COUNT(e.id) BETWEEN 6 AND 10 THEN 'Regular'
               WHEN COUNT(e.id) BETWEEN 11 AND 20 THEN 'Ativo'
               ELSE 'Extremo'
             END AS classificacao
      FROM alunos a
      LEFT JOIN emprestimos e ON a.id = e.aluno_id
         AND e.data_retirada >= ADD_MONTHS(SYSDATE, -6)
      GROUP BY a.nome
      ORDER BY livros_lidos DESC
    `);
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { rankingLeitores };
