import { Order, OrderDetail, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { CartDto } from 'src/carts/dto/request/cart.dto';
import { ProductToCartDto } from 'src/carts/dto/request/product-to-cart.dto';
import { UsersService } from 'src/users/users.service';
import { OrdersDto } from './dto/request/orders.dto';
import { OrderWithDetailDto } from './dto/response/order-with-detail.dto';
import { OrderDto } from './dto/response/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private user: UsersService) {}

  async order(
    orderWhereUniqueInput: Prisma.OrderWhereUniqueInput,
  ): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: orderWhereUniqueInput,
    });
  }

  async cartOfUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<OrderWithDetailDto> {
    const { id } = await this.user.user(userWhereUniqueInput);

    // Exist cart?
    const cart = await this.prisma.order.findFirst({
      where: {
        userId: id,
        status: 'ONCART',
      },
    });

    if (cart) {
      // get cart detail
      const cartDetail = await this.cartDetail({ orderId: cart.id });

      return plainToClass(OrderWithDetailDto, { cart, cartDetail });
    } else {
      // create new cart
      const newCart = await this.createCart({ userId: id });

      return plainToClass(OrderWithDetailDto, { newCart });
    }
  }

  async createCart(cartData: CartDto): Promise<Order> {
    const data: Prisma.OrderCreateInput = {
      clientId: { connect: { id: cartData.userId } },
      status: 'ONCART',
    };
    return this.prisma.order.create({
      data,
    });
  }

  async cartDetail(cartData: OrdersDto): Promise<OrderDetail[]> {
    return this.prisma.orderDetail.findMany({
      where: {
        orderId: cartData.orderId,
      },
    });
  }

  async addProductToCart(
    cartUuid: string,
    productData: ProductToCartDto,
  ): Promise<OrderDetail> {
    const { id: cartId } = await this.prisma.order.findUnique({
      where: {
        uuid: cartUuid,
      },
    });
    // get productId
    const { id, unitPrice } = await this.prisma.product.findUnique({
      where: {
        uuid: productData.productId,
      },
    });

    const data: Prisma.OrderDetailCreateInput = {
      order: { connect: { id: cartId } },
      product: { connect: { id: id } },
      quantity: productData.quantity,
      unitPrice: unitPrice,
      subtotal: unitPrice * productData.quantity,
    };
    // update totalprice in cart
    const totalPrice = await this.prisma.order.update({
      where: {
        id: cartId,
      },
      data: {
        totalPrice: {
          increment: unitPrice * productData.quantity,
        },
      },
    });

    return this.prisma.orderDetail.create({
      data: data,
    });
  }

  async cartToOrders(cartId: string): Promise<OrderWithDetailDto> {
    const newOrder = await this.prisma.order.update({
      where: {
        uuid: cartId,
      },
      data: {
        status: 'ORDERED',
      },
    });

    const cartDetail = await this.cartDetail({ orderId: newOrder.id });

    return plainToClass(OrderWithDetailDto, { newOrder, cartDetail });
  }

  async userOrders(userId: string): Promise<OrdersDto[]> {
    const { id } = await this.user.user({ uuid: userId });

    const cart = await this.prisma.order.findMany({
      where: {
        userId: id,
      },
    });

    return plainToClass(OrdersDto, cart);
  }

  async orderDetail(
    userId: string,
    orderId: string,
  ): Promise<OrderWithDetailDto> {
    const order = await this.order({ uuid: orderId });
    const detail = await this.cartDetail({ orderId: order.id });

    return plainToClass(OrderWithDetailDto, { order, detail });
  }
}
