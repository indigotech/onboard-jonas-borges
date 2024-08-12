import axios from 'axios';
import { expect } from 'chai';

export const loginMutationTests = (url: string) => {
  describe('login mutation tests', () => {
    it('should login an existing user with the login mutation', async () => {
      const createUserMutation = `
      mutation {
        createUser(input: {
          name: "Jonas Borges",
          email: "jonas@teste.com",
          password: "Test123",
          birthDate: "01-01-2000"
        }) {
          id
          name
          email
          birthDate
        }
      }
    `;
      await axios.post(url, { query: createUserMutation });

      const loginMutation = `
      mutation {
        login(input: {
          email: "jonas@teste.com",
          password: "Test123"
        }) {
          user {
            id
            name
            email
            birthDate
          }
          token
        }
      }
    `;

      const response = await axios.post(url, {
        query: loginMutation,
      });

      const loginData = response.data.data.login;
      expect(loginData).to.have.property('user');
      expect(loginData.user.name).to.be.equal('Jonas Borges');
      expect(loginData.user.email).to.be.equal('jonas@teste.com');
      expect(loginData.user.birthDate).to.equal('01-01-2000');
      expect(loginData).to.have.property('token');
    });

    it('should return an error when logging in with an incorrect password', async () => {
      const createUserMutation = `
      mutation {
        createUser(input: {
          name: "Jonas Borges",
          email: "jonas@teste.com",
          password: "Test123",
          birthDate: "01-01-2000"
        }) {
          id
          name
          email
          birthDate
        }
      }
    `;
      await axios.post(url, { query: createUserMutation });

      const loginMutation = `
      mutation {
        login(input: {
          email: "jonas@teste.com",
          password: "WrongPassword"
        }) {
          user {
            id
            name
            email
            birthDate
          }
          token
        }
      }
    `;

      const response = await axios.post(url, { query: loginMutation });

      const errors = response.data.errors;
      expect(errors[0].message).to.be.equal('Invalid email or password');
      expect(errors[0].extensions.code).to.be.equal('BAD_USER_INPUT');
    });

    it('should return an error when logging in with a non-existent email', async () => {
      const loginMutation = `
      mutation {
        login(input: {
          email: "nonexistent@teste.com",
          password: "Test123"
        }) {
          user {
            id
            name
            email
            birthDate
          }
          token
        }
      }
    `;

      const response = await axios.post(url, { query: loginMutation });

      const errors = response.data.errors;
      expect(errors[0].message).to.be.equal('Invalid email or password');
      expect(errors[0].extensions.code).to.be.equal('BAD_USER_INPUT');
    });
  });
};
