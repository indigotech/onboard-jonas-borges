import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password-utils.js';

const prisma = new PrismaClient();

async function main() {
  const users = Array.from({ length: 50 }, (_, i) => ({
    name: `User ${i + 1}`,
    email: `user_${i + 1}@example.com`,
    password: hashPassword(`Password${i + 1}`),
    birthDate: `20-01-${1974 + i}`,
  }));

  for (const user of users) {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: await user.password,
        birthDate: user.birthDate,
      },
    });
  }

  console.log('50 users created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
