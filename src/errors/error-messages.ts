import { CustomError } from './custom-error.js';

export class ErrorMessages {
  static emailAlreadyExists() {
    return new CustomError('BAD_USER_INPUT', 'Email already exists', 'Ensure the email is unique');
  }

  static weakPassword() {
    return new CustomError(
      'BAD_USER_INPUT',
      'Ensure the password meets security requirements',
      'Weak password. Must be at least 6 chars, 1 letter, 1 number',
    );
  }

  static invalidBirthDate() {
    return new CustomError(
      'BAD_USER_INPUT',
      'Ensure the birth date is in the correct format',
      'Invalid date format. Use DD-MM-YYYY',
    );
  }

  static invalidDate() {
    return new CustomError(
      'BAD_USER_INPUT',
      'Invalid date. Please check the values',
      'Ensure the date is a valid calendar date',
    );
  }

  static userNotFound() {
    return new CustomError('BAD_USER_INPUT', 'User not found', 'Check the user ID and try again');
  }

  static internalServerError() {
    return new CustomError('INTERNAL_SERVER_ERROR', 'Internal server error', 'An unexpected error occurred');
  }
}
