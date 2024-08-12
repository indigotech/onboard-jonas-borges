import { GraphQLError } from 'graphql';

export class ErrorMessages {
  static emailAlreadyExists() {
    return new GraphQLError('Email already exists', {
      extensions: { code: 'BAD_USER_INPUT', additionalInfo: 'Ensure the email is unique' },
    });
  }

  static weakPassword() {
    return new GraphQLError('Ensure the password meets security requirements', {
      extensions: {
        code: 'BAD_USER_INPUT',
        additionalInfo: 'Weak password. Must be at least 6 chars, 1 letter, 1 number',
      },
    });
  }

  static invalidBirthDate() {
    return new GraphQLError('Ensure the birth date is in the correct format', {
      extensions: {
        code: 'BAD_USER_INPUT',
        additionalInfo: 'Invalid date format. Use DD-MM-YYYY',
      },
    });
  }

  static invalidDate() {
    return new GraphQLError('Invalid date. Please check the values', {
      extensions: {
        code: 'BAD_USER_INPUT',
        additionalInfo: 'Ensure the date is a valid calendar date',
      },
    });
  }

  static userNotFound() {
    return new GraphQLError('User not found', {
      extensions: {
        code: 'BAD_USER_INPUT',
        additionalInfo: 'Check the user ID and try again',
      },
    });
  }

  static internalServerError() {
    return new GraphQLError('Internal server error', {
      extensions: {
        code: 'BAD_USER_INPUT',
        additionalInfo: 'An unexpected error occurred',
      },
    });
  }

  static invalidLogin() {
    return new GraphQLError('Invalid email or password', {
      extensions: {
        code: 'BAD_USER_INPUT',
        additionalInfo: 'Check your credentials and try again',
      },
    });
  }
}
