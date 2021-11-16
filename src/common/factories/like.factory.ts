import { LikeProduct, Prisma, Product } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';
import * as faker from 'faker';

type LikeProductInput = Partial<Prisma.LikeProductCreateInput>;
type LikeProductInclude = Prisma.LikeProductInclude;
type LikeProductEntinty<T> = Prisma.ProductGetPayload<{ include?: T }>;

@Injectable()
export class LikeFactory extends AbstractFactory<LikeProduct> {
  constructor(protected readonly prismaService: PrismaService) {
    super();
  }

  make<T = LikeProductInclude>(
    input: LikeProductInput = {},
    include?: T,
  ): Promise<LikeProduct> {
    return this.prismaService.likeProduct.create({
      include,
      data: {
        ...input,
        user: input.user,
        product: input.product,
      },
    });
  }

  async makeMany(
    factorial: number,
    input: LikeProductInput = {},
  ): Promise<LikeProduct[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
