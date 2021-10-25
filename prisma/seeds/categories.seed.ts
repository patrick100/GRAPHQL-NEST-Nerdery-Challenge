import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const categories: Prisma.CategoryCreateInput[] = [
  {
    name: 'Computers',
  },
  {
    name: 'Televisions',
  },
  {
    name: 'Photography',
  },
  {
    name: 'Audio',
  },
];

const categoriesSeed = async () => {
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }
};

export default categoriesSeed;
