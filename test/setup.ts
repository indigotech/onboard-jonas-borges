import { startStandaloneServer } from '@apollo/server/standalone';
import { server } from '../src/graphql/graphql-schema.js';
import * as dotenv from 'dotenv';

dotenv.config({ path: './test/test.env' });

const PORT = process.env.TEST_PORT || 4001;

export const mochaGlobalSetup = async () => {
  const { url: serverUrl } = await startStandaloneServer(server, {
    listen: { port: Number(PORT) },
  });
  console.log(`test server running on port ${PORT}`);

  return serverUrl;
};
