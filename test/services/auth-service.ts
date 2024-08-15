import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password-utils.js';
import { generateToken } from '../src/utils/jwt-utils.js';
import axios, { AxiosResponse } from 'axios';

const prisma = new PrismaClient();

export const createAuthenticatedSession = async (name: string, email: string, birthDate: string, password: string) => {
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, birthDate, password: hashedPassword },
  });

  const token = generateToken(user.id);

  return { user, token };
};

export const createUsersQuery = (limit?: number) => {
  return `
    query {
      users ${limit !== undefined ? `(limit: ${limit})` : ''} {
        id
        name
        email
        birthDate
      }
    }
  `;
};

export const createUserQuery = (id: string) => {
  return `
    query {
      user (id: "${id}") {
        id
        name
        email
        birthDate
      }
    }
  `;
};

export const createLoginMutation = (email: string, password: string) => {
  return `
      mutation {
        login(input: {
          email: "${email}",
          password: "${password}"
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
};

export const createUserMutation = (name: string, email: string, password: string, birthDate: string) => {
  return `
      mutation {
        createUser(input: {
          name: "${name}",
          email: "${email}",
          password: "${password}",
          birthDate: "${birthDate}"
        }) {
          id
          name
          email
          birthDate
          createdAt
          updatedAt
        }
      }
  `;
};

export const executeGraphQLQuery = async (
  url: string,
  query: string,
  token: string,
  variables?: object,
): Promise<AxiosResponse> => {
  return axios.post(
    url,
    {
      query,
      variables,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
