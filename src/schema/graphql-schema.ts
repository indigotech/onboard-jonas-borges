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

        const { password, ...result } = user;

        return result;
      } catch (error) {
        console.error(error);
        throw new Error('Error fetching user');
      }
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: { name: string; email: string; password: string; birthDate: string } },
    ) => {
      try {
        validatePassword(input.password);
        validateBirthDate(input.birthDate);

        const user = await prisma.user.create({
          data: input,
        });

        const { password, ...result } = user;

        return result;
      } catch (error) {
        console.error(error);
        throw new Error('Error creating user');
      }
    },
    updateUser: async (
      _: any,
      { id, input }: { id: string; input: { name?: string; email?: string; password?: string; birthDate?: string } },
    ) => {
      try {
        if (input.password) {
          validatePassword(input.password);
        }
        if (input.birthDate) {
          validateBirthDate(input.birthDate);
        }

        const user = await prisma.user.update({
          where: { id },
          data: input,
        });

        if (!user) {
          throw new Error('User not found');
        }

        const { password, ...result } = user;

        return result;
      } catch (error) {
        console.error(error);
        throw new Error('Error updating user');
      }
    },
  },
};

const validatePassword = (password: string) => {
  // Regex for checking password strength (at least 6 chars, 1 letter, 1 number)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error('Weak password. Must be at least 6 chars, 1 letter, 1 number.');
  }
};

const validateBirthDate = (birthDate: string) => {
  // Regex for checking birthDate format (DD-MM-YYYY)
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (!dateRegex.test(birthDate)) {
    throw new Error('Invalid date format. Use DD-MM-YYYY.');
  }

  const [day, month, year] = birthDate.split('-').map(Number);

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error('Invalid date. Please check the values.');
  }
};

// Create and export Apollo Server instance
export const server = new ApolloServer({
  typeDefs,
  resolvers,
});
