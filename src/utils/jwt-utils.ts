import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in .env file');
}

export function generateToken(userId: string, rememberMe?: boolean): string {
  const expiresIn = rememberMe ? '7d' : '1h';

  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn });
}
