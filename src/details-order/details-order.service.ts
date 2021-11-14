import { OrderDetail, Prisma } from '.prisma/client';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class DetailsOrderService {
  constructor(
    // @Inject(forwardRef(() => OrdersService))
    private prisma: PrismaService,
    private orderService: OrdersService,
  ) {}

  async details(
    orderData: Prisma.OrderWhereUniqueInput,
  ): Promise<OrderDetail[]> {
    let orderId: number;

    if (!orderData.id) {
      orderId = await this.orderService.getOrderId(orderData);
    } else {
      orderId = orderData.id;
    }

    return this.prisma.orderDetail.findMany({
      where: {
        orderId: orderId,
      },
    });
  }
}
