const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

// Conexão com o Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("Conectado ao PostgreSQL!"))
  .catch(err => console.error("Erro ao conectar ao PostgreSQL:", err.message));

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alunos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        matricula VARCHAR(255) UNIQUE NOT NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        pontos INTEGER DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS livros (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        autor VARCHAR(255),
        disponivel CHAR(1) DEFAULT 'S'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS emprestimos (
        id SERIAL PRIMARY KEY,
        aluno_id INTEGER REFERENCES alunos(id),
        livro_id INTEGER REFERENCES livros(id),
        data_retirada TIMESTAMP,
        data_devolucao TIMESTAMP
      );
    `);

    console.log("Tabelas verificadas e criadas com sucesso!");
  } catch (err) {
    console.error("Erro ao criar tabelas:", err.message);
  }
};

createTables();

module.exports = pool;
