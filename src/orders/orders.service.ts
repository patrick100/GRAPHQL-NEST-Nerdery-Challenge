import { Order, OrderDetail, Prisma } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ProductToCartDto } from './dto/request/product-to-cart.dto';
import { OrderDto } from './dto/response/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private user: UsersService) {}

  async getOrderId(
    orderWhereUniqueInput: Prisma.OrderWhereUniqueInput,
  ): Promise<number | null> {
    const { id } = await this.prisma.order.findUnique({
      where: orderWhereUniqueInput,
    });
    if (!id) {
      throw new HttpException('Order Not Found', HttpStatus.NOT_FOUND);
    }
    return id;
  }

  async cart(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<OrderDto> {
    const { id: userId } = await this.user.user(userWhereUniqueInput);

    // Exist cart?
    let cart = await this.prisma.order.findFirst({
      where: {
        userId: userId,
        status: 'ONCART',
      },
    });

    if (!cart) {
      cart = await this.createCart(userId);
    }

    return plainToClass(OrderDto, cart);
  }

  async createCart(UserId: number): Promise<Order> {
    const data: Prisma.OrderCreateInput = {
      clientId: { connect: { id: UserId } },
      status: 'ONCART',
    };
    return this.prisma.order.create({
      data,
    });
  }

  async addProductToCart(
    cartUuid: string,
    productData: ProductToCartDto,
  ): Promise<OrderDetail> {
    const cartId = await this.prisma.order.findUnique({
      where: {
        uuid: cartUuid,
      },
      select: {
        id: true,
      },
    });

    if (!cartId) {
      throw new HttpException('Cart Not Found', HttpStatus.NOT_FOUND);
    }

    // get productId
    const product = await this.prisma.product.findUnique({
      where: {
        uuid: productData.productId,
      },
      select: {
        id: true,
        unitPrice: true,
      },
    });

    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    }

    const data: Prisma.OrderDetailCreateInput = {
      order: { connect: { id: cartId.id } },
      product: { connect: { id: product.id } },
      quantity: productData.quantity,
      unitPrice: product.unitPrice,
      subtotal: product.unitPrice * productData.quantity,
    };
    // update totalprice in cart
    const totalPrice = await this.prisma.order.update({
      where: {
        id: cartId.id,
      },
      data: {
        totalPrice: {
          increment: product.unitPrice * productData.quantity,
        },
      },
    });

    return this.prisma.orderDetail.create({
      data: data,
    });
  }

  async cartToOrders(cartId: string): Promise<OrderDto> {
    const cartExists = await this.prisma.order.findUnique({
      where: {
        uuid: cartId,
      },
      select: {
        id: true,
      },
    });

    if (!cartExists) {
      throw new HttpException('Cart Not Found', HttpStatus.NOT_FOUND);
    }

    const newOrder = await this.prisma.order.update({
      where: {
        uuid: cartId,
      },
      data: {
        status: 'ORDERED',
      },
    });

    return newOrder;
  }

  /* Orders */

  async order(
    orderWhereUniqueInput: Prisma.OrderWhereUniqueInput,
  ): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: orderWhereUniqueInput,
    });
    if (!order) {
      throw new HttpException('Order Not Found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async ordersOfUser(
    userId: Prisma.OrderWhereUniqueInput,
  ): Promise<OrderDto[]> {
    const user = await this.user.user({ uuid: userId.uuid });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const orders = await this.prisma.order.findMany({
      where: {
        userId: user.id,
      },
    });

    return orders;
  }
}
