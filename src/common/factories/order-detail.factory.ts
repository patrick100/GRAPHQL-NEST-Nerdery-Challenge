import { OrderDetail, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';
import * as faker from 'faker';

type OrderDetailInput = Partial<Prisma.OrderDetailCreateInput>;
type OrderDetailInclude = Prisma.OrderDetailInclude;
type OrderDetailEntity<T> = Prisma.OrderDetailGetPayload<{ include?: T }>;

@Injectable()
export class OrderDetailFactory extends AbstractFactory<OrderDetail> {
  constructor(protected readonly prismaService: PrismaService) {
    super();
  }

  make<T = OrderDetailInclude>(
    input: OrderDetailInput = {},
    include?: T,
  ): Promise<OrderDetail> {
    return this.prismaService.orderDetail.create({
      include,
      data: {
        ...input,
        order: input.order,
        product: input.product,
        quantity: faker.datatype.number(),
      },
    });
  }

  async makeMany(
    factorial: number,
    input: OrderDetailInput = {},
  ): Promise<OrderDetail[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
