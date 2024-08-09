import { ApolloError } from 'apollo-server-errors';

export class CustomError extends ApolloError {
  constructor(code: string, message: string, additionalInfo?: string) {
    super(message, code, { additionalInfo: additionalInfo });
  }
}
