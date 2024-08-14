import { seedUsers } from './seed-service.js';

try {
  await seedUsers();
} catch (e) {
  console.error(e);

  process.exit(1);
}
