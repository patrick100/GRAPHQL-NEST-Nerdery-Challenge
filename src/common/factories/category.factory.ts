import { Category, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';
import * as faker from 'faker';

type CategoryInput = Partial<Prisma.CategoryCreateInput>;
type CategoryInclude = Prisma.CategoryInclude;
type CategoryEntity<T> = Prisma.CategoryGetPayload<{ include?: T }>;

@Injectable()
export class CategoryFactory extends AbstractFactory<Category> {
  constructor(protected readonly prismaService: PrismaService) {
    super();
  }

  make<T = CategoryInclude>(
    input: CategoryInput = {},
    include?: T,
  ): Promise<Category> {
    return this.prismaService.category.create({
      include,
      data: {
        ...input,
        name: faker.commerce.department(),
      },
    });
  }

  async makeMany(
    factorial: number,
    input: CategoryInput = {},
  ): Promise<Category[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
