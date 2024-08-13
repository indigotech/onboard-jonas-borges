import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type LoginResponse {
    user: User!
    token: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    birthDate: String
  }

  input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean
  }

  type Query {
    user(id: ID!): User
    users(limit: Int): [User]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    login(input: LoginInput!): LoginResponse!
  }
`;
