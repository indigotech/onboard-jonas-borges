import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define a schema using the GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    user(id: String!): User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: String!, name: String, email: String): User!
  }
`;

// Define resolvers
const resolvers = {
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

        return {
          ...user,
          createdAt: new Date(user.createdAt).toISOString(),
          updatedAt: new Date(user.updatedAt).toISOString(),
        };
      } catch (error) {
        console.error(error);
        throw new Error('Error fetching user');
      }
    },
  },
  Mutation: {
    createUser: async (_: any, { name, email }: { name: string; email: string }) => {
      try {
        const user = await prisma.user.create({
          data: {
            name,
            email,
          },
        });
        return {
          ...user,
          createdAt: new Date(user.createdAt).toISOString(),
          updatedAt: new Date(user.updatedAt).toISOString(),
        };
      } catch (error) {
        console.error(error);
        throw new Error('Error creating user');
      }
    },
    updateUser: async (_: any, { id, name, email }: { id: string; name?: string; email?: string }) => {
      try {
        const user = await prisma.user.update({
          where: { id },
          data: {
            name,
            email,
            updatedAt: new Date(),
          },
        });

        if (!user) {
          throw new Error('User not found');
        }

        return {
          ...user,
          createdAt: new Date(user.createdAt).toISOString(),
          updatedAt: new Date(user.updatedAt).toISOString(),
        };
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
