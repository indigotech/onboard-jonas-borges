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

export const seedUsersWithAddress = async (length?: number): Promise<User[]> => {
  if (!length) {
    length = 50;
  }

  const createdUsers: User[] = [];

  for (let i = 0; i < length; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        email: `user_${i + 1}@example.com`,
        password: await hashPassword(`Password${i + 1}`),
        birthDate: `20-01-${1974 + i}`,
        addresses: {
          create: [
            {
              cep: `12345-6${10 + i}`,
              street: `Rua ${i}`,
              streetNumber: `${200 + i}`,
              complement: `Ape ${i}`,
              neighborhood: `Bairro ${i}`,
              city: 'Itajuba',
              state: 'MG',
            },
            {
              cep: `54310-1${10 + i}`,
              street: `Av ${i}`,
              streetNumber: `${i}`,
              complement: `Casa ${i}`,
              neighborhood: `Bairro Novo ${i}`,
              city: 'Campinas',
              state: 'SP',
            },
          ],
        },
      },
    });
    createdUsers.push(user);
  }

  return createdUsers;
};
