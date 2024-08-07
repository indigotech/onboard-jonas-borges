import { PrismaClient } from '@prisma/client';
import { DateTimeResolver } from 'graphql-scalars';
import { hashPassword } from '../../utils/password-utils.js';
import { validateBirthDate, validatePassword } from '../../utils/user-validation.js';

const prisma = new PrismaClient();

export const userResolvers = {
  DateTime: DateTimeResolver,

  Query: {
    user: async (_: any, { id }: { id: string }) => {
      try {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
          throw new Error('User not found');
        }

        const { password, ...result } = user;

        return result;
      } catch (error) {
        console.error(error);
        throw new Error('Error fetching user');
      }
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: { name: string; email: string; password: string; birthDate: string } },
    ) => {
      try {
        validatePassword(input.password);
        validateBirthDate(input.birthDate);

        const dataToCreate = { ...input };
        dataToCreate.password = await hashPassword(input.password);

        const user = await prisma.user.create({ data: dataToCreate });

        const { password, ...result } = user;

        return result;
      } catch (error) {
        console.error(error);
        throw new Error('Error creating user');
      }
    },
    updateUser: async (
      _: any,
      { id, input }: { id: string; input: { name?: string; email?: string; password?: string; birthDate?: string } },
    ) => {
      try {
        if (input.password) {
          validatePassword(input.password);
        }
        if (input.birthDate) {
          validateBirthDate(input.birthDate);
        }

        const dataToUpdate = { ...input };
        if (input.password) {
          dataToUpdate.password = await hashPassword(input.password);
        }

        const user = await prisma.user.update({
          where: { id },
          data: dataToUpdate,
        });

        if (!user) {
          throw new Error('User not found');
        }

        const { password, ...result } = user;

        return result;
      } catch (error) {
        console.error(error);
        throw new Error('Error updating user');
      }
    },
  },
};
