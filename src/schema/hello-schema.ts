import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { PrismaClient } from '@prisma/client';
import { DateTimeResolver } from 'graphql-scalars';

const prisma = new PrismaClient();

// Define a schema using the GraphQL schema language
const typeDefs = gql`
  scalar DateTime

  type Query {
    hello: String
    user(id: ID!): User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
  }
`;

// Define resolvers
const resolvers = {
  DateTime: DateTimeResolver,

  Query: {
    hello: () => 'Hello, world!',
    user: async (_: any, { id }: { id: string }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
        });

        if (!user) {
          throw new Error('User not found');
        }

        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Error fetching user');
      }
    },
  },
  Mutation: {
    createUser: async (_: any, { input }: { input: { name: string; email: string } }) => {
      try {
        const user = await prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
          },
        });

        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Error creating user');
      }
    },
    updateUser: async (_: any, { id, input }: { id: string; input: { name?: string; email?: string } }) => {
      try {
        const user = await prisma.user.update({
          where: { id },
          data: {
            ...input,
            updatedAt: new Date(),
          },
        });

        if (!user) {
          throw new Error('User not found');
        }

        return user;
      } catch (error) {
        console.error(error);
        throw new Error('Error updating user');
      }
    },
  },
};

// Create and export Apollo Server instance
export const server = new ApolloServer({
  typeDefs,
  resolvers,
});
