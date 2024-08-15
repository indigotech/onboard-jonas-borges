import { hashPassword } from '../src/utils/password-utils.js';
import axios from 'axios';
import { expect } from 'chai';
import { PrismaClient } from '@prisma/client';
import { validateToken } from '../src/utils/jwt-utils.js';
import { createLoginMutation } from './test-service.js';

const prisma = new PrismaClient();

export const loginMutationTests = (url: string) => {
  describe('login mutation tests', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany();
    });

    it('should login an existing user with the login mutation', async () => {
      const password = await hashPassword('Test123');
      const createdUser = await prisma.user.create({
        data: {
          name: 'Jonas Borges',
          email: 'jonas@teste.com',
          birthDate: '2000-01-01',
          password,
        },
      });
      const loginMutation = createLoginMutation('jonas@teste.com', 'Test123');

      const response = await axios.post(url, {
        query: loginMutation,
      });

      const loginData = response.data.data.login;
      expect(loginData).to.have.property('user');
      expect(loginData.user.name).to.be.equal(createdUser.name);
      expect(loginData.user.email).to.be.equal(createdUser.email);
      expect(loginData.user.birthDate).to.equal(createdUser.birthDate);
      expect(loginData).to.have.property('token');
      const decodedToken = validateToken(loginData.token);
      expect(decodedToken).that.is.a('object');
      expect(decodedToken).to.have.property('id').that.is.a('string');
      expect(decodedToken).to.have.property('exp').that.is.a('number');
      expect(decodedToken).to.have.property('iat').that.is.a('number');
      expect(decodedToken.id).to.be.equal(createdUser.id);
      const currentTime = Math.floor(Date.now() / 1000);
      expect(decodedToken.iat).to.be.lessThanOrEqual(currentTime);
      expect(decodedToken.exp).to.be.lessThanOrEqual(currentTime + 3600);
    });

    it('should return an error when logging in with an incorrect password', async () => {
      const password = await hashPassword('Test123');
      await prisma.user.create({
        data: {
          name: 'Jonas Borges',
          email: 'jonas@teste.com',
          birthDate: '2000-01-01',
          password,
        },
      });
      const loginMutation = createLoginMutation('jonas@teste.com', 'WrongPassword');

      const response = await axios.post(url, { query: loginMutation });

      const errors = response.data.errors;
      expect(errors[0].message).to.be.equal('Invalid email or password');
      expect(errors[0].extensions.code).to.be.equal('BAD_USER_INPUT');
    });

    it('should return an error when logging in with a non-existent email', async () => {
      const loginMutation = createLoginMutation('jonas@teste.com', 'WrongPassword');

      const response = await axios.post(url, { query: loginMutation });

      const errors = response.data.errors;
      expect(errors[0].message).to.be.equal('Invalid email or password');
      expect(errors[0].extensions.code).to.be.equal('BAD_USER_INPUT');
    });
  });
};
