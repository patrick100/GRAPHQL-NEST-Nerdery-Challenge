import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

import usersSeed from './seeds/users.seed';

const main = async () => {
  console.log('Start seeding...');
  await usersSeed();
  /*
  await postsSeed();
  await commentsSeed();
  await reportsSeed();
  await likesSeed(); */
  console.log('Finished seeding.');
};

main()
  .then(() => {
    console.log('🎉 Seed successful');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
