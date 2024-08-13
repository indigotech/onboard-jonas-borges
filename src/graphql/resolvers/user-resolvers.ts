import { DateTimeResolver } from 'graphql-scalars';
import { UserService } from '../../services/user-service.js';
import { AuthService } from '../../services/auth-service.js';
import { ErrorMessages } from '../../errors/error-messages.js';
import { UserRepository } from '../../repositories/user-repository.js';
import { BaseContext } from '../../types/base-context.js';
import { validateTokenUserId } from '../../utils/user-validation.js';

export const userResolvers = {
  DateTime: DateTimeResolver,

  Query: {
    user: async (_: any, { id }: { id: string }, context: BaseContext) => {
      try {
        await validateTokenUserId(context.userId);

        const user = await UserRepository.findUserById(id);

        if (!user) {
          throw ErrorMessages.userNotFound();
        }

        const { password, ...result } = user;

        return result;
      } catch (error) {
        console.log(error);

        throw error;
      }
    },
    users: async (_parent: any, args: { limit?: number }, context: BaseContext) => {
      try {
        await validateTokenUserId(context.userId);

        const limit = args.limit ?? 10;
        const users = await UserRepository.findUsersWithoutPassword(limit);

        return users;
      } catch (error) {
        return error;
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
        console.log(error);

        throw error;
      }
    },

    updateUser: async (
      _: any,
      { id, input }: { id: string; input: { name?: string; email?: string; birthDate?: string } },
      context: BaseContext,
    ) => {
      try {
        await validateTokenUserId(context.userId);

        const user = await UserService.updateUser(id, input);

        const { password, ...result } = user;

        return result;
      } catch (error) {
        console.log(error);

        throw error;
      }
    },

    login: async (_: any, { input }: { input: { email: string; password: string; rememberMe?: boolean } }) => {
      try {
        const { user, token } = await AuthService.loginUser(input.email, input.password, input?.rememberMe);

        const { password, ...result } = user;

        return {
          user: result,
          token,
        };
      } catch (error) {
        console.log(error);

        throw error;
      }
    },
  },
};
