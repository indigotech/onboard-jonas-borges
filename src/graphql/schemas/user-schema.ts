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
    addresses: [Address!]!
  }

  type LoginResponse {
    user: User!
    token: String!
  }

  type UserPageInfo {
    users: [User!]!
    total: Int!
    hasPrevious: Boolean!
    hasNext: Boolean!
  }

  type Address {
    id: ID!
    cep: String!
    street: String!
    streetNumber: String!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
    userId: ID!
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
    users(limit: Int, skip: Int): UserPageInfo
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    login(input: LoginInput!): LoginResponse!
  }
`;
