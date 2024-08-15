import { hashPassword } from '../src/utils/password-utils.js';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const seedUsers = async (length?: number): Promise<User[]> => {
  if (!length) {
    length = 50;
  }

  const createdUsers: User[] = [];

  for (let i = 0; i < length; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i + 10}`,
        email: `user_${i + 10}@example.com`,
        password: await hashPassword(`Password${i + 10}`),
        birthDate: `20-01-${1974 + i}`,
      },
    });
    createdUsers.push(user);
  }

  return createdUsers;
};
