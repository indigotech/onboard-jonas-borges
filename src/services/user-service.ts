import { UserRepository } from '../repositories/user-repository.js';
import { hashPassword } from '../utils/password-utils.js';
import { validateBirthDate, validatePassword } from '../utils/user-validation.js';
import { ErrorMessages } from '../errors/error-messages.js';
import { User } from '@prisma/client';

export class UserService {
  static async createUser(data: { name: string; email: string; password: string; birthDate: string }): Promise<User> {
    validatePassword(data.password);
    validateBirthDate(data.birthDate);

    const existingUser = await UserRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw ErrorMessages.emailAlreadyExists();
    }

    data.password = await hashPassword(data.password);

    return UserRepository.createUser(data);
  }

  static async updateUser(id: string, data: { name?: string; email?: string; birthDate?: string }): Promise<User> {
    if (data.birthDate) {
      validateBirthDate(data.birthDate);
    }

    const user = await UserRepository.updateUser(id, data);

    if (!user) {
      throw ErrorMessages.userNotFound();
    }

    return user;
  }
}
