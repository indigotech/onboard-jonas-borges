import { startStandaloneServer } from '@apollo/server/standalone';
import { server } from './schema/graphql-schema.js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: Number(PORT) },
  });
  console.log(`Server running at ${url}`);
};

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
