import { startServer } from './../src/server.js';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4001;

export const mochaGlobalSetup = async () => {
  return await startServer(Number(PORT));
};
