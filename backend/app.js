const express = require("express");
const cors = require('cors');
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());

const alunoRoutes = require("./src/routes/alunoRoutes");
const livroRoutes = require("./src/routes/livroRoutes");
const emprestimoRoutes = require("./src/routes/emprestimoRoutes");
const relatorioRoutes = require("./src/routes/relatorioRoutes");

app.use("/alunos", alunoRoutes);
app.use("/livros", livroRoutes);
app.use("/emprestimos", emprestimoRoutes);
app.use("/relatorios", relatorioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
