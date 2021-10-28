import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DetailDto } from 'src/orders/dto/response/detail.dto';
import { OrderWithDetailDto } from 'src/orders/dto/response/order-with-detail.dto';
import { OrdersService } from 'src/orders/orders.service';
import { ProductToCartDto } from './dto/request/product-to-cart.dto';

// TODO Use JWT Token, replace Me in :userid
@Controller('users/:userId/carts')
export class CartsController {
  constructor(private readonly orderService: OrdersService) {}
  // TODO Use JWT Token
  @Get()
  async cart(@Param('userId') userId: string): Promise<OrderWithDetailDto> {
    const cart = await this.orderService.cartOfUser({ uuid: userId });

    return cart;
  }

  // TODO Use JWT Token
  @Post('products')
  async productToCart(
    @Param('userId') userId: string,
    @Param('cartId') cartId: string,
    @Body() productData: ProductToCartDto,
  ): Promise<DetailDto> {
    const detail = await this.orderService.addProductToCart(
      cartId,
      productData,
    );

    return detail;
  }

  // TODO Use JWT Token
  @Put(':cartId/orders')
  async cartToOrders(
    @Param('userId') userId: string,
    @Param('cartId') cartUuid: string,
  ): Promise<OrderWithDetailDto> {
    return this.orderService.cartToOrders(cartUuid);
  }
}
