import { Prisma } from '@prisma/client';
import { prisma } from '../seed';
import * as faker from 'faker';

const products: Prisma.ProductCreateInput[] = [
  {
    name: 'X515EA Core i3 11a Gen 15.6" FHD 256GB SSD 8GB RAM',
    brand: 'ASUS',
    unitPrice: 2199,
    stock: faker.datatype.number({
      min: 2,
      max: 10,
    }),
    category: { connect: { id: 1 } },
  },
  {
    name: 'Laptop HP 15-ef1019la AMD Ryzen 5 4500U 8GB 512GB SSD 15.6"',
    brand: 'HP',
    unitPrice: 2899,
    stock: faker.datatype.number({
      min: 2,
      max: 10,
    }),
    category: { connect: { id: 1 } },
  },
  {
    name: 'Television Sony 55" 4K Ultra HD Google TV Smart TV LED KD-55X80J',
    brand: 'SONY',
    unitPrice: 4399,
    stock: faker.datatype.number({
      min: 2,
      max: 10,
    }),
    category: { connect: { id: 2 } },
  },
  {
    name: 'Smart TV 55" 4k Ultra HD 55AU7000',
    brand: 'SAMSUNG',
    unitPrice: 1999,
    stock: faker.datatype.number({
      min: 2,
      max: 10,
    }),
    category: { connect: { id: 2 } },
  },
  {
    name: 'Camera Reflex EOS Rebel T100',
    brand: 'CANON',
    unitPrice: 1599,
    stock: faker.datatype.number({
      min: 2,
      max: 10,
    }),
    category: { connect: { id: 3 } },
  },
  {
    name: 'Headphones AirPods 2nd Generation',
    brand: 'APPLE',
    unitPrice: 649,
    stock: faker.datatype.number({
      min: 2,
      max: 10,
    }),
    category: { connect: { id: 4 } },
  },
  {
    name: 'Headphones Skullcandy Dime True wireless Black',
    brand: 'SKULLCANDY',
    unitPrice: 149,
    stock: faker.datatype.number({
      min: 2,
      max: 10,
    }),
    category: { connect: { id: 4 } },
  },
];

const productsSeed = async () => {
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }
};

export default productsSeed;
