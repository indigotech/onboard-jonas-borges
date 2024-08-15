import { PrismaClient } from '@prisma/client';
import { expect } from 'chai';
import { createAuthenticatedSession, createUserMutation, executeGraphQLQuery } from '../services/test-service.js';

const prisma = new PrismaClient();

export const createUserTests = (url: string) => {
  describe('createUser mutation tests', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
    });

    it('should create a new user with the createUser mutation', async () => {
      const { token } = await createAuthenticatedSession(
        'Jonas Moraes',
        'jonas.token@teste.com',
        '2000-01-01',
        'Test123',
      );
      const newUserMutation = createUserMutation('Jonas Borges', 'jonas@teste.com', 'Test123', '01-01-2000');

      const response = await executeGraphQLQuery(url, newUserMutation, token);

      const userData = response.data.data.createUser;
      expect(userData).to.have.property('id');
      expect(userData.name).to.be.equal('Jonas Borges');
      expect(userData.email).to.be.equal('jonas@teste.com');
      expect(userData.birthDate).to.equal('01-01-2000');
      const userInDb = await prisma.user.findUnique({ where: { email: 'jonas@teste.com' } });
      expect(userInDb).to.not.be.null;
      expect(userInDb?.name).to.be.equal('Jonas Borges');
      expect(userInDb?.email).to.be.equal('jonas@teste.com');
      expect(userInDb?.birthDate).to.be.equal('01-01-2000');
      expect(userInDb?.password).to.not.be.equal('Test123');
    });

    it('should return an error when providing an invalid token', async () => {
      const invalidToken = 'invalid.token.string';
      const newUserMutation = createUserMutation('Jonas Borges', 'jonas@teste.com', 'Test123', '01-01-2000');

      const response = await executeGraphQLQuery(url, newUserMutation, invalidToken);

      const errorResponse = response.data.errors[0];
      expect(errorResponse.extensions.code).to.be.equal('BAD_USER_INPUT');
      expect(errorResponse.message).to.be.equal('Invalid token');
    });

    it('should return an error when creating a user with an existing email', async () => {
      const { token } = await createAuthenticatedSession('Jonas Moraes', 'jonas@teste.com', '2000-01-01', 'Test123');
      const newUserMutation = createUserMutation('Jonas Borges', 'jonas@teste.com', 'Test123', '01-01-2000');

      const response = await executeGraphQLQuery(url, newUserMutation, token);

      const errorResponse = response.data.errors[0];
      expect(errorResponse.extensions.code).to.be.equal('BAD_USER_INPUT');
      expect(errorResponse.message).to.be.equal('Email already exists');
      expect(errorResponse.extensions.additionalInfo).to.be.equal('Ensure the email is unique');
    });

    it('should return an error when creating a user with a weak password', async () => {
      const { token } = await createAuthenticatedSession(
        'Jonas Moraes',
        'jonas.token@teste.com',
        '2000-01-01',
        'Test123',
      );
      const newUserMutation = createUserMutation('Jonas Borges', 'jonas@teste.com', '123', '01-01-2000');

      const response = await executeGraphQLQuery(url, newUserMutation, token);

      const errorResponse = response.data.errors[0];
      expect(errorResponse.extensions.code).to.be.equal('BAD_USER_INPUT');
      expect(errorResponse.message).to.be.equal('Ensure the password meets security requirements');
      expect(errorResponse.extensions.additionalInfo).to.be.equal(
        'Weak password. Must be at least 6 chars, 1 letter, 1 number',
      );
    });

    it('should return an error when creating a user with an invalid birth date', async () => {
      const { token } = await createAuthenticatedSession(
        'Jonas Moraes',
        'jonas.token@teste.com',
        '2000-01-01',
        'Test123',
      );
      const newUserMutation = createUserMutation('Jonas Borges', 'jonas@teste.com', 'Test123', '01-01/2000');

      const response = await executeGraphQLQuery(url, newUserMutation, token);

      const errorResponse = response.data.errors[0];
      expect(errorResponse.extensions.code).to.be.equal('BAD_USER_INPUT');
      expect(errorResponse.message).to.be.equal('Ensure the birth date is in the correct format');
      expect(errorResponse.extensions.additionalInfo).to.be.equal('Invalid date format. Use DD-MM-YYYY');
    });
  });
};
