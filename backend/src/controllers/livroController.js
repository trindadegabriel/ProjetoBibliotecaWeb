const db = require("../config/db");

function cadastrarLivro(req, res) {
  const { titulo, autor } = req.body;
  const sql = "INSERT INTO livros (titulo, autor, disponivel) VALUES (?, ?, 'S')";
  db.run(sql, [titulo, autor], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Livro cadastrado!", id: this.lastID });
  });
}

function listarDisponiveis(req, res) {
  db.all("SELECT * FROM livros WHERE disponivel = 'S'", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

module.exports = { cadastrarLivro, listarDisponiveis };
