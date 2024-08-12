import { DateTimeResolver } from 'graphql-scalars';
import { UserService } from '../../services/user-service.js';
import { AuthService } from '../../services/auth-service.js';
import { ErrorMessages } from '../../errors/error-messages.js';
import { UserRepository } from '../../repositories/user-repository.js';
import { BaseContext } from '../../types/base-context.js';
import { validateTokenUserId } from '../../utils/user-validation.js';
import { CustomError } from '../../errors/custom-error.js';

export const userResolvers = {
  DateTime: DateTimeResolver,

  Query: {
    user: async (_: any, { id }: { id: string }) => {
      try {
        const user = await UserRepository.findUserById(id);

        if (!user) {
          throw ErrorMessages.userNotFound();
        }

        const { password, ...result } = user;

        return result;
      } catch (error) {
        if (error instanceof GraphQLError) {
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
      context: BaseContext,
    ) => {
      try {
        await validateTokenUserId(context.userId);

        const user = await UserService.createUser(input);

        const { password, ...result } = user;

        return result;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw ErrorMessages.internalServerError();
      }
    },

    updateUser: async (
      _: any,
      { id, input }: { id: string; input: { name?: string; email?: string; birthDate?: string } },
      context: BaseContext,
    ) => {
      try {
        if (!context.userId) {
          throw ErrorMessages.invalidToken();
        }

        const user = await UserService.updateUser(id, input);

        const { password, ...result } = user;

        return result;
      } catch (error) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw ErrorMessages.internalServerError();
      }
    },

    login: async (_: any, { input }: { input: { email: string; password: string; rememberMe?: boolean } }) => {
      try {
        const { user, token } = await AuthService.loginUser(input.email, input.password);

        const { id, name, email, birthDate } = user;

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
        if (error instanceof GraphQLError) {
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
