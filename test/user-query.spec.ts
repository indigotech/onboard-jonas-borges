import axios from 'axios';
import { expect } from 'chai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userQueryTests = (url: string) => {
  describe('user query tests', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
    });

    it('should return the correct user when querying with a valid ID', async () => {
      const createdUser = await prisma.user.create({
        data: {
          name: 'Jonas Borges',
          email: 'jonas@teste.com',
          birthDate: '2000-01-01',
          password: 'password',
        },
      });

      const userQuery = `
        query {
          user(id: "${createdUser.id}") {
            id
            name
            email
            birthDate
          }
        }
      `;

      const response = await axios.post(url, {
        query: userQuery,
      });

      const userData = response.data.data.user;
      expect(userData.id).to.be.equal(createdUser.id);
      expect(userData.name).to.be.equal(createdUser.name);
      expect(userData.email).to.be.equal(createdUser.email);
      expect(userData.birthDate).to.be.equal(createdUser.birthDate);
    });

    it('should return an error when querying a user that does not exist', async () => {
      const userQuery = `
      query {
        user(id: "d0851a74-f9b2-4507-9405-6b3d7d8869b9") {
          id
          name
          email
          birthDate
        }
      }
    `;

      const response = await axios.post(url, {
        query: userQuery,
      });

      const errorResponse = response.data.errors[0];
      expect(errorResponse.extensions.code).to.be.equal('BAD_USER_INPUT');
      expect(errorResponse.message).to.be.equal('User not found');
      expect(errorResponse.extensions.additionalInfo).to.be.equal('Check the user ID and try again');
    });
  });
};
