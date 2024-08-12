import { ApolloServer } from '@apollo/server';
import { userTypeDefs } from './schemas/user-schema.js';
import { userResolvers } from './resolvers/user-resolvers.js';
import { GraphQLError } from 'graphql';

export const server = new ApolloServer({
  typeDefs: [userTypeDefs],
  resolvers: [userResolvers],
  formatError: (formattedError, error) => {
    if (error instanceof GraphQLError) {
      return error;
    }

    return formattedError;
  },
});
