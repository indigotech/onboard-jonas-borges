import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCb);
const KEYLEN = 64;
const SALT_LENGTH = 16;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const keyBuffer = (await scrypt(password, salt, KEYLEN)) as Buffer;

  return `${salt}:${keyBuffer.toString('base64')}`;
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const [salt, key] = hashedPassword.split(':');
  const keyBuffer = Buffer.from(key, 'base64');
  const derivedKeyBuffer = (await scrypt(password, salt, KEYLEN)) as Buffer;

  return timingSafeEqual(keyBuffer, derivedKeyBuffer);
};
