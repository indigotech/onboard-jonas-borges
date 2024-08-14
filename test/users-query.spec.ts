import axios from 'axios';
import { expect } from 'chai';
import { PrismaClient } from '@prisma/client';
import { createAuthenticatedSession } from './test-service.js';
import { seedUsers } from '../scripts/seed-service.js';

const prisma = new PrismaClient();

export const usersQueryTests = (url: string) => {
  describe('users query tests', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
    });

    it('should return users ordered alphabetically with a limit', async () => {
      const { token } = await createAuthenticatedSession('Jonas Borges', 'jonas@teste.com', '2000-01-01', 'Test123');

      await seedUsers(10);

      const usersQuery = `
        query {
          users(limit: 5, skip: 2) {
            users {
              id
              name
              email
              birthDate
            }
            total
            hasPrevious
            hasNext
          }
        }
      `;

      const response = await axios.post(
        url,
        {
          query: usersQuery,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const usersData = response.data.data.users;
      expect(usersData.users).to.have.lengthOf(5);
      expect(usersData.total).to.be.equal(11);
      expect(usersData.hasPrevious).to.be.true;
      expect(usersData.hasNext).to.be.true;

      usersData.users.forEach((user: { name: string }, i: number, arr: Array<{ name: string }>) => {
        if (i > 0) {
          expect(user.name.localeCompare(arr[i - 1].name)).to.be.greaterThan(0);
        }
      });
    });

    it('should return a default number of users if limit is not provided', async () => {
      const { token } = await createAuthenticatedSession('Jonas Borges', 'jonas@teste.com', '2000-01-01', 'Test123');

      await seedUsers(20);

      const usersQuery = `
        query {
          users {
            users {
              id
              name
              email
              birthDate
            }
            total
            hasPrevious
            hasNext
          }
        }
      `;

      const response = await axios.post(
        url,
        {
          query: usersQuery,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const usersData = response.data.data.users;
      expect(usersData.users).to.have.lengthOf(10);
      expect(usersData.total).to.be.equal(21);
      expect(usersData.hasPrevious).to.be.false;
      expect(usersData.hasNext).to.be.true;
    });

    it('should return remaining users after skipping a number of users', async () => {
      const { token } = await createAuthenticatedSession('Jonas Borges', 'jonas@teste.com', '2000-01-01', 'Test123');

      await seedUsers(20);

      const usersQuery = `
        query {
          users (limit: 5, skip: 17) {
            users {
              id
              name
              email
              birthDate
            }
            total
            hasPrevious
            hasNext
          }
        }
      `;

      const response = await axios.post(
        url,
        {
          query: usersQuery,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const usersData = response.data.data.users;
      expect(usersData.users).to.have.lengthOf(4);
      expect(usersData.total).to.be.equal(21);
      expect(usersData.hasPrevious).to.be.true;
      expect(usersData.hasNext).to.be.false;
    });

    it('should return an error when providing an invalid token', async () => {
      const invalidToken = 'invalid.token.string';

      const usersQuery = `
        query {
          users {
            users {
              id
              name
              email
              birthDate
            }
            total
            hasPrevious
            hasNext
          }
        }
      `;

      const response = await axios.post(
        url,
        {
          query: usersQuery,
        },
        {
          headers: {
            Authorization: `Bearer ${invalidToken}`,
          },
        },
      );

      const errorResponse = response.data.errors[0];
      expect(errorResponse.extensions.code).to.be.equal('BAD_USER_INPUT');
      expect(errorResponse.message).to.be.equal('Invalid token');
    });
  });
};
