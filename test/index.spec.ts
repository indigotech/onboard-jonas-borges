import axios from 'axios';
import { expect } from 'chai';
import { mochaGlobalSetup } from './setup.js';
import { PrismaClient } from '@prisma/client';
import { helloTests } from './hello-query.spec.js';
import { createUserTests } from './create-user-mutation.js';
import { userQueryTests } from './user-query.spec.js';

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

  it('hello query', async () => {
    helloTests(url);
  });

  it('user query', async () => {
    userQueryTests(url);
  });

  it('createUser mutation', async () => {
    createUserTests(url);
  });
});
