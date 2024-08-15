import { expect } from 'chai';
import { PrismaClient, User } from '@prisma/client';
import { createAuthenticatedSession, createUsersQuery, executeGraphQLQuery } from '../services/test-service.js';
import { seedUsers } from '../../scripts/seed-service.js';

const prisma = new PrismaClient();

export const usersQueryTests = (url: string) => {
  describe('users query tests', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
    });

    it('should return users ordered alphabetically with a limit', async () => {
      const { token } = await createAuthenticatedSession('X Jonas Borges', 'jonas@teste.com', '2000-01-01', 'Test123');
      const users = await seedUsers(10);
      const usersQuery = createUsersQuery(5);

      const response = await executeGraphQLQuery(url, usersQuery, token);

      const usersData = response.data.data.users;
      expect(usersData).to.have.property('users');
      expect(usersData).to.have.property('total');
      expect(usersData).to.have.property('hasPrevious');
      expect(usersData).to.have.property('hasNext');
      expect(usersData.users).to.have.lengthOf(5);
      expect(usersData.total).to.be.equal(11);
      expect(usersData.hasPrevious).to.be.false;
      expect(usersData.hasNext).to.be.true;
      const expectedUsers = users.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 5);
      const usersDataNames = usersData.users.map((user: User) => user.name);
      const expectedUsersNames = expectedUsers.map((user) => user.name);
      expect(usersDataNames).to.deep.equal(expectedUsersNames);
    });

    it('should return a default number of users if limit is not provided', async () => {
      const { token } = await createAuthenticatedSession('Jonas Borges', 'jonas@teste.com', '2000-01-01', 'Test123');

      await seedUsers(20);
      const usersQuery = createUsersQuery();

      const response = await executeGraphQLQuery(url, usersQuery, token);

      const usersData = response.data.data.users;
      expect(usersData.users).to.have.lengthOf(10);
      expect(usersData.total).to.be.equal(21);
      expect(usersData.hasPrevious).to.be.false;
      expect(usersData.hasNext).to.be.true;
    });

    it('should return remaining users after skipping a number of users', async () => {
      const { token } = await createAuthenticatedSession('Jonas Borges', 'jonas@teste.com', '2000-01-01', 'Test123');
      await seedUsers(20);
      const usersQuery = createUsersQuery(5, 17);

      const response = await executeGraphQLQuery(url, usersQuery, token);

      const usersData = response.data.data.users;
      expect(usersData.users).to.have.lengthOf(4);
      expect(usersData.total).to.be.equal(21);
      expect(usersData.hasPrevious).to.be.true;
      expect(usersData.hasNext).to.be.false;
    });

    it('should return an error when providing an invalid token', async () => {
      const invalidToken = 'invalid.token.string';
      const usersQuery = createUsersQuery();

      const response = await executeGraphQLQuery(url, usersQuery, invalidToken);

      const errorResponse = response.data.errors[0];
      expect(errorResponse.extensions.code).to.be.equal('BAD_USER_INPUT');
      expect(errorResponse.message).to.be.equal('Invalid token');
    });
  });
};
