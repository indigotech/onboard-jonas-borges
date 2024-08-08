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

// Clear user table before each test
beforeEach(async () => {
  await prisma.user.deleteMany();
});

// Clear user table after all tests and disconnect
after(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('GraphQL API Tests', () => {
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
});
