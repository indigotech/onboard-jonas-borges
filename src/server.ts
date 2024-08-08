import { startStandaloneServer } from '@apollo/server/standalone';
import { server } from './graphql/graphql-schema.js';

export const startServer = async (port: number) => {
  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });
  console.log(`Server running at ${url}`);

  return url;
};
