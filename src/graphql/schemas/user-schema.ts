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

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
    birthDate: String
  }

  type Query {
    hello: String
    user(id: ID!): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
  }
`;
