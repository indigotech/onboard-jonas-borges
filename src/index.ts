import { startServer } from './server.js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 4000;

try {
  await startServer(Number(PORT));
} catch (err) {
  console.error('Error starting server:', err);
}
