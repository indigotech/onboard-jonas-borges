# 🌟 Sistema de Gerenciamento de Usuários

## 📄 Descrição do Projeto

Este projeto é um sistema de gerenciamento de usuários que permite **criar, ler, atualizar e deletar (CRUD)** informações de usuários. Foi desenvolvido para facilitar a administração e o controle de dados dos usuários de uma aplicação.

## 🛠️ Ambiente e Ferramentas

- **Linguagem de Programação**: TypeScript (Node.js) 🟢
- **Servidor Web**: Apollo Server 🖥️
- **GraphQL**: Para definir e expor o schema de dados 📊
- **Versão do Node.js**: Recomendado usar a versão 20.16.0 🟢
- **Ferramentas de Desenvolvimento**:
  - Apollo Server (para testar queries) 🎨
  - `dotenv` (para gerenciamento de variáveis de ambiente) 🌟
  - **Prisma**: ORM para interagir com o banco de dados de forma eficiente e intuitiva 🛢️
  - **Docker**: Para containerização e gerenciamento dos bancos de dados PostgreSQL 🐳

## 🚀 Passos para Rodar e Depurar

### Pré-requisitos

- Certifique-se de ter o Node.js instalado. Recomenda-se a versão 20.16.0
- Certifique-se de ter o Docker instalado e em execução.
- Crie o arquivo **.env**. Recomenda-se seguir o modelo .env_example

### Passos para Configuração e Execução

1. **Clone o repositório do projeto**:

   ```sh
   git clone https://github.com/indigotech/onboard-jonas-borges.git
   cd onboard-jonas-borges
   docker-compose up -d
   npm install
   npm run migrate:deploy
   npm start
   ```
