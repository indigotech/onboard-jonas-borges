import { expect } from 'chai';
import { mochaGlobalSetup } from './setup.js';
import { PrismaClient } from '@prisma/client';
import { createUserTests } from './create-user-mutation.js';
import { userQueryTests } from './user-query.spec.js';
import { loginMutationTests } from './login-mutation.js';

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

describe('GraphQL API Tests', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should have a valid server URL', () => {
    expect(url).to.not.be.undefined;
  });

  it('user query', async () => {
    userQueryTests(url);
  });

  it('createUser mutation', async () => {
    createUserTests(url);
  });

  it('login mutation', async () => {
    loginMutationTests(url);
  });
});
