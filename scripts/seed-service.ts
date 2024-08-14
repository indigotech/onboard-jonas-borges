import { hashPassword } from '../src/utils/password-utils.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedUsers = async (length?: number) => {
  if (!length) {
    length = 50;
  }

  const users = await Promise.all(
    Array.from({ length }, async (_, i) => ({
      name: `User ${i + 10}`,
      email: `user_${i + 10}@example.com`,
      password: await hashPassword(`Password${i + 10}`),
      birthDate: `20-01-${1974 + i}`,
    })),
  );

  await prisma.user.createMany({ data: users });

  return users;
};
