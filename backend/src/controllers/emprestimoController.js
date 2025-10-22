const db = require("../config/db");

//Função para registrar retirada de livro
function retirarLivro(req, res) {
  const { aluno_id, livro_id } = req.body;

  //Verifica se o livro está disponível
  db.get("SELECT disponivel FROM livros WHERE id = ?", [livro_id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Livro não encontrado" });
    if (row.disponivel === 'N') return res.status(400).json({ message: "Livro não disponível" });

    //Insere o empréstimo
    const sqlEmprestimo = `
      INSERT INTO emprestimos (aluno_id, livro_id, data_retirada)
      VALUES (?, ?, datetime('now'))
    `;
    db.run(sqlEmprestimo, [aluno_id, livro_id], function(err) {
      if (err) return res.status(500).json({ error: err.message });

      //Atualiza o livro para indisponível
      db.run("UPDATE livros SET disponivel = 'N' WHERE id = ?", [livro_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ 
          message: "Empréstimo registrado com sucesso!", 
          emprestimo_id: this.lastID 
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

module.exports = { retirarLivro, devolverLivro };
