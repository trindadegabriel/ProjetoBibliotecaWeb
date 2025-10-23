const db = require("../config/db");

//Função para registrar retirada de livro
// No seu emprestimoController.js
function retirarLivro(req, res) {
  const { matricula, livro_id } = req.body;

  // Passo 1: buscar aluno pelo matrícula
  db.get("SELECT id FROM alunos WHERE matricula = ?", [matricula], (err, aluno) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!aluno) return res.status(404).json({ message: "Aluno não encontrado" });

    const aluno_id = aluno.id;

    // Passo 2: verificar se o livro está disponível
    db.get("SELECT disponivel FROM livros WHERE id = ?", [livro_id], (err, livro) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!livro) return res.status(404).json({ message: "Livro não encontrado" });
      if (livro.disponivel === 'N') return res.status(400).json({ message: "Livro não disponível" });

      // Passo 3: inserir empréstimo
      const sqlEmprestimo = `
        INSERT INTO emprestimos (aluno_id, livro_id, data_retirada)
        VALUES (?, ?, datetime('now'))
      `;
      db.run(sqlEmprestimo, [aluno_id, livro_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });

        // Passo 4: atualizar livro para indisponível
        db.run("UPDATE livros SET disponivel = 'N' WHERE id = ?", [livro_id], (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.status(201).json({ 
            message: "Empréstimo registrado com sucesso!", 
            emprestimo_id: this.lastID 
          });
        });
      });
    });
  });
}

//Função para registrar devolução de livro
function devolverLivro(req, res) {
  const { id } = req.params;

  //Busca o empréstimo
  db.get("SELECT livro_id, aluno_id, data_devolucao FROM emprestimos WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Empréstimo não encontrado" });
    if (row.data_devolucao) return res.status(400).json({ message: "Livro já devolvido" });

    const { livro_id, aluno_id } = row;

    //Atualiza a data de devolução
    db.run("UPDATE emprestimos SET data_devolucao = datetime('now') WHERE id = ?", [id], function(err) {
      if (err) return res.status(500).json({ error: err.message });

      //Atualiza o livro para disponível
      db.run("UPDATE livros SET disponivel = 'S' WHERE id = ?", [livro_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        //Incrementa pontuação do aluno
        db.run("UPDATE alunos SET pontos = pontos + 1 WHERE id = ?", [aluno_id], (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({ message: "Devolução registrada e pontuação atualizada!" });
        });
      });
    });
  });
}

function listarEmprestimosPorAluno(req, res) {
  const matricula = req.params.matricula || req.query.matricula;
  if (!matricula) return res.status(400).json({ error: "Matrícula não informada" });

  const query = `
    SELECT 
      e.id AS emprestimo_id,
      l.titulo,
      l.autor,
      e.data_retirada,
      e.data_devolucao
    FROM emprestimos e
    JOIN livros l ON e.livro_id = l.id
    JOIN alunos a ON e.aluno_id = a.id
    WHERE a.matricula = ? 
      AND e.data_devolucao IS NULL
  `;

  db.all(query, [matricula.toString()], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

function listarTodosEmprestimos(req, res) {
  const sql = `
    SELECT 
      e.id AS emprestimo_id,
      a.nome AS nome_aluno,
      a.matricula,
      l.titulo AS livro_titulo,
      l.autor AS livro_autor,
      e.data_retirada,
      e.data_devolucao,
      CASE 
        WHEN e.data_devolucao IS NULL THEN 'Emprestado'
        ELSE 'Devolvido'
      END AS status
    FROM emprestimos e
    JOIN alunos a ON e.aluno_id = a.id
    JOIN livros l ON e.livro_id = l.id
    ORDER BY e.data_retirada DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar empréstimos:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
}


module.exports = { retirarLivro, devolverLivro, listarEmprestimosPorAluno, listarTodosEmprestimos };
