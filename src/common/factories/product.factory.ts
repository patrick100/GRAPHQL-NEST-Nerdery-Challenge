import { Prisma, Product } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';
import * as faker from 'faker';

type ProductInput = Partial<Prisma.ProductCreateInput>;
type ProductInclude = Prisma.ProductInclude;
type ProductEntity<T> = Prisma.ProductGetPayload<{ include?: T }>;

@Injectable()
export class ProductFactory extends AbstractFactory<Product> {
  constructor(protected readonly prismaService: PrismaService) {
    super();
  }

  make<T = ProductInclude>(
    input: ProductInput = {},
    include?: T,
  ): Promise<Product> {
    return this.prismaService.product.create({
      include,
      data: {
        ...input,
        name: faker.commerce.productName(),
        brand: faker.company.companyName(),
        unitPrice: faker.datatype.number(),
        category: input.category,
        measurementUnit: 'unit',
        isEnabled: faker.datatype.boolean(),
        stock: faker.datatype.number(),
        description: faker.commerce.productDescription(),
      },
    });
  }

  async makeMany(
    factorial: number,
    input: ProductInput = {},
  ): Promise<Product[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
