import { OrderDetail, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class DetailsOrderService {
  constructor(private prisma: PrismaService) {}

  async details(
    orderData: Prisma.OrderWhereUniqueInput,
  ): Promise<OrderDetail[]> {
    let orderId: { id: number };

    if (!orderData.id) {
      orderId = await this.prisma.order.findUnique({
        where: {
          ...orderData,
        },
        select: {
          id: true,
        },
      });
    } else {
      orderId = { id: orderData.id };
    }

    return this.prisma.orderDetail.findMany({
      where: {
        orderId: orderId.id,
      },
    });
  }
}
