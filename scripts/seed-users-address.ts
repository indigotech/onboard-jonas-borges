import { seedUsersWithAddress } from './seed-service.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  await seedUsersWithAddress();
} catch (e) {
  console.error(e);

  process.exit(1);
}

await prisma.$disconnect();
