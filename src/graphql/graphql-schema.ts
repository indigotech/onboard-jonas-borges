import { ApolloServer } from '@apollo/server';
import { userTypeDefs } from './schemas/user-schema.js';
import { userResolvers } from './resolvers/user-resolvers.js';

export const server = new ApolloServer({
  typeDefs: [userTypeDefs],
  resolvers: [userResolvers],
});
