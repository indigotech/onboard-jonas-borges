import { UserRepository } from '../repositories/user-repository.js';
import { comparePassword } from '../utils/password-utils.js';
import { ErrorMessages } from '../errors/error-messages.js';
import { User } from '@prisma/client';
import { generateToken } from '../utils/jwt-utils.js';

export class AuthService {
  static async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      throw ErrorMessages.userNotFound();
    }

    const passwordValid = await comparePassword(password, user.password);
    if (!passwordValid) {
      throw ErrorMessages.invalidLogin();
    }

    return {
      user,
      token: generateToken(user.id),
    };
  }
}
