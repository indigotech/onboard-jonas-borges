import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';

// Define a schema using the GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
  },
};

// Create and export Apollo Server instance
export const server = new ApolloServer({
  typeDefs,
  resolvers,
});
