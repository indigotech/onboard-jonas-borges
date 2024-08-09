import axios from 'axios';
import { expect } from 'chai';
import { mochaGlobalSetup } from './setup.js';
import { PrismaClient } from '@prisma/client';

let url: string;
const prisma = new PrismaClient();

// Start server before tests
before(async () => {
  url = await mochaGlobalSetup();
});

// Clear user table after all tests and disconnect
after(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Hello Query', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should execute the hello query', async () => {
    const response = await axios.post(url, {
      query: `
        query {
          hello
        }
      `,
    });

    expect(response.data.data.hello).to.be.equal('Hello, world!');
  });
});

describe('User Query', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should return a user successfully when querying an existing user', async () => {
    const createdUser = await prisma.user.create({
      data: {
        name: 'Jonas Borges',
        email: 'jonas@teste.com',
        password: 'hashed_password',
        birthDate: '01-01-2000',
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
    expect(userData).to.have.property('id');
    expect(userData.name).to.be.equal('Jonas Borges');
    expect(userData.email).to.be.equal('jonas@teste.com');
    expect(userData.birthDate).to.be.equal('01-01-2000');
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
    expect(errorResponse.extensions.code).to.be.equal('404');
    expect(errorResponse.message).to.be.equal('User not found');
    expect(errorResponse.extensions.additionalInfo).to.be.equal('Check the user ID and try again');
  });
});

describe('Create User Mutation', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should create a new user with the createUser mutation', async () => {
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
          createdAt
          updatedAt
        }
      }
    `;

    const response = await axios.post(url, {
      query: createUserMutation,
    });

    const userData = response.data.data.createUser;
    expect(userData).to.have.property('id');
    expect(userData.name).to.be.equal('Jonas Borges');
    expect(userData.email).to.be.equal('jonas@teste.com');
    expect(userData.birthDate).to.equal('01-01-2000');

    // Ensure user exists in DB
    const userInDb = await prisma.user.findUnique({ where: { email: 'jonas@teste.com' } });
    expect(userInDb).to.not.be.null;
    expect(userInDb?.name).to.be.equal('Jonas Borges');
    expect(userInDb?.email).to.be.equal('jonas@teste.com');
    expect(userInDb?.birthDate).to.be.equal('01-01-2000');
    expect(userInDb?.password).to.not.be.equal('Test123');
  });

  it('should return an error when creating a user with an existing email', async () => {
    await prisma.user.create({
      data: {
        name: 'Jonas Borges',
        email: 'jonas@teste.com',
        password: 'hashedpassword',
        birthDate: '01-01-2000',
      },
    });

    const createUserMutation = `
      mutation {
        createUser(input: {
          name: "Another User",
          email: "jonas@teste.com",
          password: "Test123",
          birthDate: "02-02-2002"
        }) {
          id
          name
          email
          birthDate
        }
      }
    `;

    const response = await axios.post(url, {
      query: createUserMutation,
    });

    const errorResponse = response.data.errors[0];
    expect(errorResponse.extensions.code).to.be.equal('400');
    expect(errorResponse.message).to.be.equal('Email already exists');
    expect(errorResponse.extensions.additionalInfo).to.be.equal('Ensure the email is unique');
  });

  it('should return an error when creating a user with a weak password', async () => {
    const createUserMutation = `
      mutation {
        createUser(input: {
          name: "Weak Password User",
          email: "weak@password.com",
          password: "123",
          birthDate: "03-03-2003"
        }) {
          id
          name
          email
          birthDate
        }
      }
    `;

    const response = await axios.post(url, {
      query: createUserMutation,
    });

    const errorResponse = response.data.errors[0];
    expect(errorResponse.extensions.code).to.be.equal('400');
    expect(errorResponse.message).to.be.equal('Ensure the password meets security requirements');
    expect(errorResponse.extensions.additionalInfo).to.be.equal(
      'Weak password. Must be at least 6 chars, 1 letter, 1 number',
    );
  });

  it('should return an error when creating a user with an invalid birth date', async () => {
    const createUserMutation = `
      mutation {
        createUser(input: {
          name: "Invalid Date User",
          email: "invalid@date.com",
          password: "Test123",
          birthDate: "20/01-1992"
        }) {
          id
          name
          email
          birthDate
        }
      }
    `;

    const response = await axios.post(url, {
      query: createUserMutation,
    });

    const errorResponse = response.data.errors[0];
    expect(errorResponse.extensions.code).to.be.equal('400');
    expect(errorResponse.message).to.be.equal('Ensure the birth date is in the correct format');
    expect(errorResponse.extensions.additionalInfo).to.be.equal('Invalid date format. Use DD-MM-YYYY');
  });
});

describe('Login Mutation', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

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
          createdAt
          updatedAt
        }
      }
    `;

    const userResponse = await axios.post(url, {
      query: createUserMutation,
    });
    const user = userResponse.data.data.createUser;

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
    expect(loginData.user.name).to.be.equal(user.name);
    expect(loginData.user.email).to.be.equal(user.email);
    expect(loginData.user.birthDate).to.equal(user.birthDate);
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
    expect(errors[0].extensions.code).to.be.equal('401');
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
    expect(errors[0].message).to.be.equal('User not found');
    expect(errors[0].extensions.code).to.be.equal('404');
  });
});
