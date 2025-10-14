const { getConnection } = require("../config/db");

async function cadastrarLivro(req, res) {
  const { titulo, autor } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO livros (titulo, autor, disponivel)
       VALUES (:titulo, :autor, 'S')`,
      [titulo, autor],
      { autoCommit: true }
    );
    await conn.close();
    res.status(201).json({ message: "Livro cadastrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listarDisponiveis(req, res) {
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      "SELECT id, titulo, autor FROM livros WHERE disponivel = 'S'"
    );
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { cadastrarLivro, listarDisponiveis };
