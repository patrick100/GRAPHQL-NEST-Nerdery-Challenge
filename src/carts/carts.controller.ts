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
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DetailDto } from 'src/orders/dto/response/detail.dto';
import { OrderWithDetailDto } from 'src/orders/dto/response/order-with-detail.dto';
import { OrdersService } from 'src/orders/orders.service';
import { ProductToCartDto } from './dto/request/product-to-cart.dto';

@ApiTags('Carts')
@Controller('users/me/carts')
export class CartsController {
  constructor(private readonly orderService: OrdersService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async cart(@Request() req): Promise<OrderWithDetailDto> {
    const cart = await this.orderService.cartOfUser({ uuid: req.user.uuid });

    return cart;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post(':cartId/products')
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
  @Put(':cartId/orders')
  async cartToOrders(
    @Param('cartId') cartUuid: string,
  ): Promise<OrderWithDetailDto> {
    return this.orderService.cartToOrders(cartUuid);
  }
}
