import { PrismaClient } from '@prisma/client';
import { generateToken } from '../../src/utils/jwt-utils.js';
import { hashPassword } from '../../src/utils/password-utils.js';

const prisma = new PrismaClient();

export const createAuthenticatedSession = async (name: string, email: string, birthDate: string, password: string) => {
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, birthDate, password: hashedPassword },
  });

  const token = generateToken(user.id);

  return { user, token };
};
