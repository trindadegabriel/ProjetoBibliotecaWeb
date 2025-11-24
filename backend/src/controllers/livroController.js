const pool = require("../config/db");

//Cadastrar livro
async function cadastrarLivro(req, res) {
  const { titulo, autor } = req.body;

  const sql = `
    INSERT INTO livros (titulo, autor, disponivel)
    VALUES ($1, $2, 'S')
    RETURNING id;
  `;

  try {
    const result = await pool.query(sql, [titulo, autor]);
    res.status(201).json({
      message: "Livro cadastrado!",
      id: result.rows[0].id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//Listar livros
async function listarLivros(req, res) {
  try {
    const result = await pool.query("SELECT * FROM livros");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { cadastrarLivro, listarLivros };
