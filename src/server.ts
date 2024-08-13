import { startStandaloneServer } from '@apollo/server/standalone';
import { server } from './graphql/graphql-schema.js';
import { validateToken } from './utils/jwt-utils.js';
import { BaseContext } from './types/base-context.js';

export const startServer = async (port: number) => {
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async ({ req, res }): Promise<BaseContext> => {
      const token = req.headers.authorization || '';
      let userId: string | undefined;

      try {
        const decodedToken = validateToken(token);

        userId = decodedToken.id;
      } catch (error) {
        userId = undefined;
      }

      return { userId };
    },
  });
  console.log(`Server running at ${url}`);

  return url;
};
