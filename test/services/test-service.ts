import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/utils/password-utils.js';
import { generateToken } from '../../src/utils/jwt-utils.js';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const prisma = new PrismaClient();

export const createAuthenticatedSession = async (
  name: string,
  email: string,
  birthDate: string,
  password: string,
  addresses?: Array<{
    cep: string;
    street: string;
    streetNumber: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  }>,
) => {
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      birthDate,
      password: hashedPassword,
      addresses: addresses ? { create: addresses } : undefined,
    },
    include: { addresses: true },
  });

  const token = generateToken(user.id);

  return { user, token };
};

export const createUsersQuery = () => {
  return `
    query users($limit: Int, $skip: Int) {
      users(limit: $limit, skip: $skip) {
        users {
          id
          name
          email
          birthDate
          addresses {
            id
            cep
            street
            streetNumber
            complement
            neighborhood
            city
            state
            userId
          }
        }
        total
        hasPrevious
        hasNext
      }
    }
  `;
};

export const createUserQuery = () => {
  return `
    query user($id: ID!) {
      user(id: $id) {
        id
        name
        email
        birthDate
        addresses {
          id
          cep
          street
          streetNumber
          complement
          neighborhood
          city
          state
          userId
        }
      }
    }
  `;
};

export const createLoginMutation = () => {
  return `
    mutation login($input: LoginInput!) {
      login(input: $input) {
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

export const createUserMutation = () => {
  return `
    mutation createUser($input: CreateUserInput!) {
      createUser(input: $input) {
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
  token?: string,
  variables?: object,
): Promise<AxiosResponse> => {
  const config: AxiosRequestConfig = {
    headers: {},
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return axios.post(
    url,
    {
      query,
      variables,
    },
    config,
  );
};
