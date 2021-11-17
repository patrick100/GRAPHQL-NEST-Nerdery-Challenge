import { OrderDetail } from '.prisma/client';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';
import { DetailsOrderService } from 'src/details-order/details-order.service';
import { DetailDto } from 'src/details-order/dto/response/detail.dto';
import { OrderWithDetailDto } from 'src/OLD/dto/response/order-with-detail.dto';
import { ProductToCartDto } from './dto/request/product-to-cart.dto';
import { OrderDto } from './dto/response/order.dto';
import { OrdersService } from './orders.service';

@Controller('users')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly detailService: DetailsOrderService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('me/carts')
  async cart(@Request() req): Promise<OrderDto> {
    const cart = await this.orderService.cart({ uuid: req.user.uuid });

    return cart;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post('me/carts/:cartId/products')
  async productToCart(
    @Param('cartId') cartId: string,
    @Body() productData: ProductToCartDto,
  ): Promise<DetailDto> {
    const detail = await this.orderService.addProductToCart(
      cartId,
      productData,
    );

    return detail;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Put('me/carts/:cartId/orders')
  async cartToOrders(@Param('cartId') cartUuid: string): Promise<OrderDto> {
    return this.orderService.cartToOrders(cartUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/orders/:orderId')
  async order(
    @Request() req,
    @Param('orderId') orderId: string,
  ): Promise<OrderDetail[]> {
    return this.detailService.details({ uuid: orderId });
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Get(':userId/orders')
  async userOrders(@Param('userId') userId: string): Promise<OrderDto[]> {
    return this.orderService.ordersOfUser({ uuid: userId });
  }
}
