# Resumo das Ações da Aplicação

## Consultas (Queries)

### 1. Obter um Usuário pelo ID

Esta consulta permite recuperar informações detalhadas de um usuário específico com base no ID fornecido.

```graphql
query {
  getUser(id: "f9e662fd-760a-476c-82bb-a1681f27b6f0") {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

**Campos retornados:**

- `id`: Identificador único do usuário.
- `name`: Nome completo do usuário.
- `email`: Endereço de email do usuário.
- `createdAt`: Data e hora em que o usuário foi criado.
- `updatedAt`: Data e hora da última atualização do usuário.

### 2. Consulta Simples de Saudação

Esta consulta retorna uma mensagem de saudação simples.

```graphql
query Query {
  hello
}
```

**Resposta esperada:**

- `hello`: Mensagem de saudação.

## Mutations (Mutations)

### 1. Criar um Novo Usuário

Utilize esta mutação para criar um novo usuário com as informações fornecidas.

```graphql
mutation {
  createUser(name: "João", email: "joao@example.com") {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

**Campos retornados:**

- `id`: Identificador único do usuário criado.
- `name`: Nome do usuário criado.
- `email`: Email do usuário criado.
- `createdAt`: Data e hora em que o usuário foi criado.
- `updatedAt`: Data e hora da última atualização do usuário (inicialmente igual a `createdAt`).

### 2. Atualizar Informações de um Usuário Existente

Utilize esta mutação para atualizar os detalhes de um usuário existente com base no ID fornecido.

```graphql
mutation {
  updateUser(id: "f9e662fd-760a-476c-82bb-a1681f27b6f0", name: "Jonas Borges", email: "jonas_2@example.com") {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

**Campos retornados:**

- `id`: Identificador único do usuário atualizado.
- `name`: Nome atualizado do usuário.
- `email`: Email atualizado do usuário.
- `createdAt`: Data e hora em que o usuário foi criado (não alterada).
- `updatedAt`: Data e hora da última atualização do usuário.
