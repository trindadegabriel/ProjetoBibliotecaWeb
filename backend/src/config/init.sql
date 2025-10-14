-- init.sql

CREATE TABLE alunos (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR2(100) NOT NULL,
    matricula VARCHAR2(20) UNIQUE NOT NULL,
    data_cadastro DATE DEFAULT SYSDATE
);

CREATE TABLE livros (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR2(200) NOT NULL,
    autor VARCHAR2(100),
    disponivel CHAR(1) DEFAULT 'S' CHECK (disponivel IN ('S','N'))
);

CREATE TABLE emprestimos (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    aluno_id NUMBER REFERENCES alunos(id),
    livro_id NUMBER REFERENCES livros(id),
    data_retirada DATE,
    data_devolucao DATE
);
