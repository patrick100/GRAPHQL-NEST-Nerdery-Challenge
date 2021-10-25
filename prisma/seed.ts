import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

import usersSeed from './seeds/users.seed';
import categoriesSeed from './seeds/categories.seed';
import productsSeed from './seeds/products.seed';
import likeProductsSeed from './seeds/like-products.seed';
import ordersSeed from './seeds/orders.seed';

const main = async () => {
  console.log('Start seeding...');
  await usersSeed();
  await categoriesSeed();
  await productsSeed();
  await likeProductsSeed();
  await ordersSeed();
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
