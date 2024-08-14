import { seedUsers } from './seed-service.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  await seedUsers();
} catch (e) {
  console.error(e);

  process.exit(1);
}

await prisma.$disconnect();
