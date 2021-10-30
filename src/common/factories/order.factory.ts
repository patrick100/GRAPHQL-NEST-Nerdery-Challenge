import { Order, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';
import * as faker from 'faker';

type OrderInput = Partial<Prisma.OrderCreateInput>;
type OrderInclude = Prisma.OrderInclude;
type OrderEntity<T> = Prisma.OrderGetPayload<{ include?: T }>;

@Injectable()
export class OrderFactory extends AbstractFactory<Order> {
  constructor(protected readonly prismaService: PrismaService) {
    super();
  }

  make<T = OrderInclude>(
    input: OrderInput,
    include?: T,
  ): Promise<OrderEntity<T>> {
    return this.prismaService.order.create({
      include,
      data: {
        uuid: faker.datatype.uuid(),
        createdAt: faker.datatype.datetime(),
        clientId: { connect: { id: faker.datatype.number() } },
        totalPrice: faker.datatype.number(),
      },
    });
  }

  async makeMany(factorial: number, input: OrderInput = {}): Promise<Order[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
