import { PrismaClient } from '@prisma/client';
import { DateTimeResolver } from 'graphql-scalars';
import { comparePassword, hashPassword } from '../../utils/password-utils.js';
import { validateBirthDate, validatePassword } from '../../utils/user-validation.js';
import { ErrorMessages } from '../../errors/error-messages.js';
import { CustomError } from '../../errors/custom-error.js';
import { generateToken } from '../../utils/jwt-utils.js';

const prisma = new PrismaClient();

export const userResolvers = {
  DateTime: DateTimeResolver,

  Query: {
    hello: () => 'Hello, world!',
    user: async (_: any, { id }: { id: string }) => {
      try {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
          throw ErrorMessages.userNotFound();
        }

        const { password, ...result } = user;

        return result;
      } catch (error) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw ErrorMessages.internalServerError();
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

        const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
        if (existingUser) {
          throw ErrorMessages.emailAlreadyExists();
        }

        const dataToCreate = { ...input };
        dataToCreate.password = await hashPassword(input.password);

        const user = await prisma.user.create({ data: dataToCreate });

        const { password, ...result } = user;

        return result;
      } catch (error) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw ErrorMessages.internalServerError();
      }
    },
    updateUser: async (
      _: any,
      { id, input }: { id: string; input: { name?: string; email?: string; birthDate?: string } },
    ) => {
      try {
        if (input.birthDate) {
          validateBirthDate(input.birthDate);
        }

        const user = await prisma.user.update({
          where: { id },
          data: input,
        });

        if (!user) {
          throw ErrorMessages.userNotFound();
        }

        const { password, ...result } = user;

        return result;
      } catch (error) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw ErrorMessages.internalServerError();
      }
    },

    login: async (_: any, { input }: { input: { email: string; password: string } }) => {
      try {
        const user = await prisma.user.findUnique({ where: { email: input.email } });
        if (!user) {
          throw ErrorMessages.userNotFound();
        }

        const passwordValid = await comparePassword(input.password, user.password);
        if (!passwordValid) {
          throw ErrorMessages.invalidLogin();
        }

        const { id, name, email, birthDate } = user;

        const token = generateToken(id);

        return {
          user: {
            id,
            name,
            email,
            birthDate,
          },
          token,
        };
      } catch (error) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw ErrorMessages.internalServerError();
      }
    },
  },
};
