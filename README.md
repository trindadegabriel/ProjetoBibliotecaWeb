# ProjetoBibliotecaWeb

# Sistema de Gestão de Biblioteca Universitária

Este projeto é uma aplicação **Node.js + Express + SQLite** para gerenciar uma biblioteca universitária.  
Permite cadastrar alunos e livros, registrar empréstimos e devoluções, e visualizar relatórios de leitura.

## Tecnologias utilizadas

- Node.js  
- Express  
- SQLite3  
- Nodemon (ambiente de desenvolvimento)  

## Pré-requisitos

Antes de começar, você precisa ter instalado:
- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- Git (para clonar o repositório)

## Passos para rodar o projeto localmente

Instalar as dependências:
- npm install

Rodar o servidor:
- npm start

Acessar a aplicação:
- http://localhost:3000

Para apagar o banco de dados e recriar automaticamente:

- del biblioteca.db

## Endpoints da APi

- Alunos
Método      Endpoint                Descrição

POST	    /alunos	                    Cadastra um novo aluno
GET	        /alunos	                    Lista todos os alunos
GET	        /alunos/:id/pontuacao	    Retorna a pontuação e classificação do aluno

- Livros
Método	    Endpoint	                Descrição

POST	    /livros	                    Cadastra um novo livro
GET	        /livros/disponiveis	        Lista livros disponíveis

- Empréstimos
Método	    Endpoint	                Descrição

POST	    /emprestimos	            Registra a retirada de um livro
PUT	        /emprestimos/:id/devolucao	Registra a devolução de um livro

- Relatórios
Método	    Endpoint	                Descrição

GET	        /relatorios/classificacao	Exibe ranking de leitores