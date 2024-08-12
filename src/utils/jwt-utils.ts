import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { ErrorMessages } from '../errors/error-messages.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in .env file');
}

export function generateToken(userId: string, rememberMe?: boolean): string {
  const expiresIn = rememberMe === true ? '7d' : '1h';

  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn });
}

export function validateToken(authHeader: string | undefined): string {
  if (!authHeader) {
    throw ErrorMessages.invalidToken();
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    return decoded.id;
  } catch (error) {
    throw ErrorMessages.invalidToken();
  }
}
