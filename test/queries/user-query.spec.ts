import { expect } from 'chai';
import { PrismaClient } from '@prisma/client';
import { createAuthenticatedSession, createUserQuery, executeGraphQLQuery } from '../services/test-service.js';

const prisma = new PrismaClient();

export const userQueryTests = (url: string) => {
  describe('user query tests', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
    });

    it('should return the correct user when querying with a valid ID', async () => {
      const { user, token } = await createAuthenticatedSession(
        'Jonas Borges',
        'jonas@teste.com',
        '2000-01-01',
        'Test123',
        [
          {
            cep: '12345-678',
            street: 'Rua Exemplo',
            streetNumber: '123',
            neighborhood: 'Bairro Legal',
            city: 'Itajubá',
            state: 'MG',
          },
          {
            cep: '87654-321',
            street: 'Avenida Exemplo',
            streetNumber: '456',
            neighborhood: 'Bairro Central',
            city: 'Campinas',
            state: 'SP',
          },
        ],
      );
      const userQuery = createUserQuery();
      const variables = { id: user.id };

      const response = await executeGraphQLQuery(url, userQuery, token, variables);
      const response = await executeGraphQLQuery(url, userQuery, token, variables);

      const userData = response.data.data.user;
      expect(userData.id).to.be.equal(user.id);
      expect(userData.name).to.be.equal(user.name);
      expect(userData.email).to.be.equal(user.email);
      expect(userData.birthDate).to.be.equal(user.birthDate);
      expect(userData.addresses).to.deep.equal(user.addresses);
    });

    it('should return an error when providing an invalid token', async () => {
      const { user } = await createAuthenticatedSession('Jonas Borges', 'jonas@teste.com', '2000-01-01', 'Test123');
      const invalidToken = 'invalid.token.string';
      const userQuery = createUserQuery();
      const variables = { id: user.id };
      const userQuery = createUserQuery();
      const variables = { id: user.id };

      const response = await executeGraphQLQuery(url, userQuery, invalidToken, variables);
      const response = await executeGraphQLQuery(url, userQuery, invalidToken, variables);

      const errorResponse = response.data.errors[0];
      expect(errorResponse.extensions.code).to.be.equal('BAD_USER_INPUT');
      expect(errorResponse.message).to.be.equal('Invalid token');
    });

    it('should return an error when querying a user that does not exist', async () => {
      const { token } = await createAuthenticatedSession('Jonas Borges', 'jonas@teste.com', '2000-01-01', 'Test123');
      const userQuery = createUserQuery();
      const variables = { id: 'd0851a74-f9b2-4507-9405-6b3d7d8869b9' };
      const userQuery = createUserQuery();
      const variables = { id: 'd0851a74-f9b2-4507-9405-6b3d7d8869b9' };

      const response = await executeGraphQLQuery(url, userQuery, token, variables);
      const response = await executeGraphQLQuery(url, userQuery, token, variables);

      const errorResponse = response.data.errors[0];
      expect(errorResponse.extensions.code).to.be.equal('BAD_USER_INPUT');
      expect(errorResponse.message).to.be.equal('User not found');
      expect(errorResponse.extensions.additionalInfo).to.be.equal('Check the user ID and try again');
    });
  });
};
