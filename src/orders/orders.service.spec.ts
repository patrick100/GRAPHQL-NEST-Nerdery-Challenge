import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrdersService } from './orders.service';
import * as faker from 'faker';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Category, Order, Product, Status, User } from '.prisma/client';
import { UserFactory } from 'src/common/factories/user.factory';
import { OrderFactory } from 'src/common/factories/order.factory';
import { OrderDetailFactory } from 'src/common/factories/order-detail.factory';
import { ProductFactory } from 'src/common/factories/product.factory';
import { CategoryFactory } from 'src/common/factories/category.factory';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './dto/response/order.dto';
import { ProductToCartDto } from './dto/request/product-to-cart.dto';
import { OrdersModule } from './orders.module';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { LikesService } from 'src/likes/likes.service';

describe('OrdersService', () => {
  let orderService: OrdersService;
  let prismaService: PrismaService;

  let orderFactory: OrderFactory;
  let orderDetailFactory: OrderDetailFactory;
  let userFactory: UserFactory;
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;

  let orderTest: Order;
  let userTest: User;
  let productTest: Product;
  let categoryTest: Category;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, OrdersModule, UsersModule, ProductsModule],
      providers: [
        OrderFactory,
        UserFactory,
        OrderDetailFactory,
        ProductFactory,
        CategoryFactory,
        LikesService,
      ],
    }).compile();

    orderService = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);

    orderFactory = module.get<OrderFactory>(OrderFactory);
    orderDetailFactory = module.get<OrderDetailFactory>(OrderDetailFactory);
    userFactory = module.get<UserFactory>(UserFactory);
    productFactory = module.get<ProductFactory>(ProductFactory);
    categoryFactory = module.get<CategoryFactory>(CategoryFactory);

    categoryTest = await categoryFactory.make({});
    productTest = await productFactory.make({
      category: { connect: { id: categoryTest.id } },
    });

    userTest = await userFactory.make({});
    orderTest = await orderFactory.make({
      status: Status.ONCART,
      clientId: { connect: { id: userTest.id } },
    });

    await orderDetailFactory.make({
      order: { connect: { id: orderTest.id } },
      product: { connect: { id: productTest.id } },
    });
  });

  afterAll(async () => {
    await prismaService.clearDatabase();
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('getOrderId', () => {
    it('should throw an exception if order doesnt exist', async () => {
      await expect(
        orderService.getOrderId({ uuid: faker.datatype.uuid() }),
      ).rejects.toThrowError(
        new HttpException('Order Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should return the order id', async () => {
      const order = await orderService.getOrderId({
        uuid: orderTest.uuid,
      });

      expect(order).toEqual(orderTest.id);
    });
  });

  describe('order', () => {
    it('should throw an exception if order doesnt exist', async () => {
      await expect(
        orderService.order({ uuid: faker.datatype.uuid() }),
      ).rejects.toThrowError(
        new HttpException('Order Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should return an order info', async () => {
      const order = await orderService.order({
        uuid: orderTest.uuid,
      });

      expect(order).toEqual(orderTest);
    });
  });

  describe('cartOfUser', () => {
    it('should retrieve user cart info', async () => {
      const userNew = await userFactory.make({});
      const cart = await orderFactory.make({
        clientId: { connect: { id: userNew.id } },
      });
      const newOrder = await orderService.cart({
        uuid: userNew.uuid,
      });

      const orderDto = plainToClass(OrderDto, cart);

      expect(newOrder).toEqual(orderDto);
    });
  });

  describe('createCart', () => {
    it('should create a cart for a user', async () => {
      const spy = jest.spyOn(prismaService.order, 'create');
      const userNew = await userFactory.make({});

      await orderService.createCart(userNew.id);

      expect(spy).toBeCalledWith({
        data: {
          clientId: { connect: { id: userNew.id } },
          status: Status.ONCART,
        },
      });
    });
  });

  describe('addProductToCart', () => {
    it('should throw an exception if cart doesnt exist', async () => {
      const productData = {
        orderId: orderTest.uuid,
        productId: productTest.uuid,
        quantity: faker.datatype.number(),
      };
      await expect(
        orderService.addProductToCart(faker.datatype.uuid(), productData),
      ).rejects.toThrowError(
        new HttpException('Cart Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if product doesnt exist', async () => {
      const productData = {
        orderId: orderTest.uuid,
        productId: faker.datatype.uuid(),
        quantity: faker.datatype.number(),
      };
      await expect(
        orderService.addProductToCart(orderTest.uuid, productData),
      ).rejects.toThrowError(
        new HttpException('Product Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should create/add an order detail', async () => {
      const spy = jest.spyOn(prismaService.orderDetail, 'create');
      const data: ProductToCartDto = {
        productId: productTest.uuid,
        quantity: 2,
      };

      await orderService.addProductToCart(orderTest.uuid, data);

      expect(spy).toBeCalledWith({
        data: {
          order: { connect: { id: orderTest.id } },
          product: { connect: { id: productTest.id } },
          unitPrice: productTest.unitPrice,
          quantity: 2,
          subtotal: productTest.unitPrice * 2,
        },
      });
    });
  });

  describe('cartToOrders', () => {
    it('should throw an exception if cart doesnt exist', async () => {
      await expect(
        orderService.cartToOrders(faker.datatype.uuid()),
      ).rejects.toThrowError(
        new HttpException('Cart Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should update cart status from ONCART to ORDERED', async () => {
      const orderUpdated = await orderService.cartToOrders(orderTest.uuid);
      expect(orderUpdated.status).toEqual(Status.ORDERED);
    });
  });

  describe('ordersOfUser', () => {
    it('should throw an exception if user doesnt exist', async () => {
      await expect(
        orderService.ordersOfUser({ uuid: faker.datatype.uuid() }),
      ).rejects.toThrowError(
        new HttpException('User Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should retrieve a list of orders from a user', async () => {
      const orders = await orderService.ordersOfUser({ uuid: userTest.uuid });

      orders.forEach((element) => {
        expect(element.userId).toBe(userTest.id);
      });
    });
  });
});
