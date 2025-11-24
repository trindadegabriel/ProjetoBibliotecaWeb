const pool = require("../config/db");

async function retirarLivro(req, res) {
  const { matricula, livro_id } = req.body;

  try {
    //Buscar aluno
    const alunoResult = await pool.query(
      "SELECT id FROM alunos WHERE matricula = $1",
      [matricula]
    );

    if (alunoResult.rowCount === 0)
      return res.status(404).json({ message: "Aluno não encontrado" });

    const aluno_id = alunoResult.rows[0].id;

    //Verificar disponibilidade do livro
    const livroResult = await pool.query(
      "SELECT disponivel FROM livros WHERE id = $1",
      [livro_id]
    );

    if (livroResult.rowCount === 0)
      return res.status(404).json({ message: "Livro não encontrado" });

    if (livroResult.rows[0].disponivel === "N")
      return res.status(400).json({ message: "Livro não disponível" });

    // Registrar empréstimo
    const emprestimoResult = await pool.query(
      `
      INSERT INTO emprestimos (aluno_id, livro_id, data_retirada)
      VALUES ($1, $2, NOW())
      RETURNING id;
      `,
      [aluno_id, livro_id]
    );

    //Atualizar livro para indisponível
    await pool.query(
      "UPDATE livros SET disponivel = 'N' WHERE id = $1",
      [livro_id]
    );

    res.status(201).json({
      message: "Empréstimo registrado com sucesso!",
      emprestimo_id: emprestimoResult.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//Registrar devolução de livro
async function devolverLivro(req, res) {
  const { id } = req.params;

  try {
    //Buscar empréstimo
    const emprestimoResult = await pool.query(
      "SELECT livro_id, aluno_id, data_devolucao FROM emprestimos WHERE id = $1",
      [id]
    );

    if (emprestimoResult.rowCount === 0)
      return res.status(404).json({ message: "Empréstimo não encontrado" });

    const { livro_id, aluno_id, data_devolucao } = emprestimoResult.rows[0];

    if (data_devolucao)
      return res.status(400).json({ message: "Livro já devolvido" });

    //Atualizar data de devolução
    await pool.query(
      "UPDATE emprestimos SET data_devolucao = NOW() WHERE id = $1",
      [id]
    );

    //Tornar livro disponível
    await pool.query(
      "UPDATE livros SET disponivel = 'S' WHERE id = $1",
      [livro_id]
    );

    //Atualizar pontuação
    await pool.query(
      "UPDATE alunos SET pontos = pontos + 1 WHERE id = $1",
      [aluno_id]
    );

    res.json({ message: "Devolução registrada e pontuação atualizada!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//Listar empréstimos em aberto por aluno
async function listarEmprestimosPorAluno(req, res) {
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
    WHERE a.matricula = $1
      AND e.data_devolucao IS NULL
  `;

  try {
    const result = await pool.query(query, [matricula]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//Listar todos os empréstimos
async function listarTodosEmprestimos(req, res) {
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

  try {
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { retirarLivro, devolverLivro, listarEmprestimosPorAluno, listarTodosEmprestimos };
