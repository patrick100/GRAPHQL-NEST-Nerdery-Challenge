import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';
import { OrdersDto } from './dto/request/orders.dto';
import { OrderWithDetailDto } from './dto/response/order-with-detail.dto';
import { OrderDto } from './dto/response/order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('users')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/orders/:orderId')
  async order(
    @Request() req,
    @Param('orderId') orderId: string,
  ): Promise<OrderWithDetailDto> {
    return this.orderService.orderDetail(orderId);
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Get(':userId/orders')
  async userOrders(@Param('userId') userId: string): Promise<OrderDto[]> {
    return this.orderService.userOrders(userId);
  }
}
