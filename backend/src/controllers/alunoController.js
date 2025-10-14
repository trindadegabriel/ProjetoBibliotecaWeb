const { getConnection } = require("../config/db");

async function cadastrarAluno(req, res) {
  const { nome, matricula } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO alunos (nome, matricula, data_cadastro)
       VALUES (:nome, :matricula, SYSDATE)`,
      [nome, matricula],
      { autoCommit: true }
    );
    await conn.close();
    res.status(201).json({ message: "Aluno cadastrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listarAlunos(req, res) {
  try {
    const conn = await getConnection();
    const result = await conn.execute("SELECT * FROM alunos");
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPontuacao(req, res) {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT COUNT(*) AS livros_lidos FROM emprestimos
       WHERE aluno_id = :id AND data_retirada >= ADD_MONTHS(SYSDATE, -6)`,
      [id]
    );
    await conn.close();

    const livrosLidos = result.rows[0][0];
    let classificacao = "Iniciante";
    if (livrosLidos >= 6 && livrosLidos <= 10) classificacao = "Regular";
    else if (livrosLidos >= 11 && livrosLidos <= 20) classificacao = "Ativo";
    else if (livrosLidos > 20) classificacao = "Extremo";

    res.json({ id, livrosLidos, classificacao });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { cadastrarAluno, listarAlunos, getPontuacao };
