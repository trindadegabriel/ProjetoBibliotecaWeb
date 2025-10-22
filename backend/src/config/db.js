const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./biblioteca.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco SQLite:", err.message);
  } else {
    console.log("Conectado ao banco SQLite!");
  }
});

// Criação automática das tabelas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      matricula TEXT UNIQUE NOT NULL,
      data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP,
      pontos INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT,
      disponivel TEXT DEFAULT 'S'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS emprestimos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aluno_id INTEGER,
      livro_id INTEGER,
      data_retirada TEXT,
      data_devolucao TEXT,
      FOREIGN KEY (aluno_id) REFERENCES alunos(id),
      FOREIGN KEY (livro_id) REFERENCES livros(id)
    )
  `);
});

module.exports = db;
