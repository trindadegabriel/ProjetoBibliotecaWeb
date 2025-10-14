const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

// Rotas
const alunoRoutes = require("./routes/alunoRoutes");
const livroRoutes = require("./routes/livroRoutes");
const emprestimoRoutes = require("./routes/emprestimoRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");

app.use("/alunos", alunoRoutes);
app.use("/livros", livroRoutes);
app.use("/emprestimos", emprestimoRoutes);
app.use("/relatorios", relatorioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
