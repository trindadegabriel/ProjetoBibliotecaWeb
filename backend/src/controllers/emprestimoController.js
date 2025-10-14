const { getConnection } = require("../config/db");

async function retirarLivro(req, res) {
  const { alunoId, livroId } = req.body;
  try {
    const conn = await getConnection();

    await conn.execute(
      `INSERT INTO emprestimos (aluno_id, livro_id, data_retirada)
       VALUES (:alunoId, :livroId, SYSDATE)`,
      [alunoId, livroId],
      { autoCommit: true }
    );

    await conn.execute(
      `UPDATE livros SET disponivel = 'N' WHERE id = :livroId`,
      [livroId],
      { autoCommit: true }
    );

    await conn.close();
    res.status(201).json({ message: "Livro retirado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function devolverLivro(req, res) {
  const { id } = req.params;
  try {
    const conn = await getConnection();

    const result = await conn.execute(
      `UPDATE emprestimos SET data_devolucao = SYSDATE
       WHERE id = :id RETURNING livro_id INTO :livroId`,
      { id, livroId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
      { autoCommit: true }
    );

    const livroId = result.outBinds.livroId[0];
    await conn.execute(
      `UPDATE livros SET disponivel = 'S' WHERE id = :livroId`,
      [livroId],
      { autoCommit: true }
    );

    await conn.close();
    res.json({ message: "Livro devolvido com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { retirarLivro, devolverLivro };
