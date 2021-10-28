import { Controller, Get, Param } from '@nestjs/common';
import { OrdersDto } from './dto/request/orders.dto';
import { OrderWithDetailDto } from './dto/response/order-with-detail.dto';
import { OrdersService } from './orders.service';

@Controller('users')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  // TODO Manager
  @Get(':userId/orders')
  async userOrders(@Param('userId') userId: string): Promise<OrdersDto[]> {
    return this.orderService.userOrders(userId);
  }

  // TODO Use JWT
  @Get(':userId/orders/:orderId')
  async order(
    @Param('userId') userId: string,
    @Param('orderId') orderId: string,
  ): Promise<OrderWithDetailDto> {
    return this.orderService.orderDetail(userId, orderId);
  }
}
