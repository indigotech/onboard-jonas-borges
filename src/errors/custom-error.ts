import { ApolloError } from 'apollo-server-errors';

export class CustomError extends ApolloError {
  constructor(code: number, message: string, additionalInfo?: string) {
    super(message, code.toString(), { additionalInfo: additionalInfo });
  }
}
