import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { OrdersService } from './orders.service';
import * as faker from 'faker';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  Category,
  Order,
  OrderDetail,
  Prisma,
  Product,
  Status,
  User,
} from '.prisma/client';
import { UserFactory } from 'src/common/factories/user.factory';
import { OrderFactory } from 'src/common/factories/order.factory';
import { OrderDetailFactory } from 'src/common/factories/order-detail.factory';
import { ProductFactory } from 'src/common/factories/product.factory';
import { CategoryFactory } from 'src/common/factories/category.factory';
import { OrderWithDetailDto } from './dto/response/order-with-detail.dto';
import { plainToClass } from 'class-transformer';
import { CartDto } from 'src/carts/dto/request/cart.dto';
import { number } from 'joi';
import { ProductToCartDto } from 'src/carts/dto/request/product-to-cart.dto';

describe('OrdersService', () => {
  let orderService: OrdersService;
  let userService: UsersService;
  let prismaService: PrismaService;

  let orderFactory: OrderFactory;
  let orderDetailFactory: OrderDetailFactory;
  let userFactory: UserFactory;
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;

  let orderTest: Order;
  let orderDetailTest: OrderDetail;
  let userTest: User;
  let productTest: Product;
  let categoryTest: Category;
  let orderWithDetailTest: OrderWithDetailDto;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        OrdersService,
        UsersService,
        OrderFactory,
        UserFactory,
        OrderDetailFactory,
        ProductFactory,
        CategoryFactory,
      ],
    }).compile();

    orderService = module.get<OrdersService>(OrdersService);
    userService = module.get<UsersService>(UsersService);
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

    orderDetailTest = await orderDetailFactory.make({
      order: { connect: { id: orderTest.id } },
      product: { connect: { id: productTest.id } },
    });

    orderWithDetailTest = plainToClass(OrderWithDetailDto, {
      orderTest,
      orderDetailTest,
    });
  });

  afterAll(async () => {
    // await prismaService.clearDatabase();
    await prismaService.$disconnect();
    // await module.close();
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
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
    it('should retrieve user cart info with detail', async () => {
      const userNew = await userFactory.make({});
      const cart = await orderFactory.make({
        // status: Status.ONCART,
        clientId: { connect: { id: userNew.id } },
      });
      const detail = [];
      const newOrder = await orderService.cartOfUser({
        uuid: userNew.uuid,
      });

      const orderDto = plainToClass(OrderWithDetailDto, { cart, detail });

      expect(newOrder).toEqual(orderDto);
    });
  });

  describe('createCart', () => {
    it('should create a cart for a user', async () => {
      const spy = jest.spyOn(prismaService.order, 'create');
      const userNew = await userFactory.make({});
      const data: CartDto = {
        userId: userNew.id,
      };

      await orderService.createCart(data);

      expect(spy).toBeCalledWith({
        data: {
          clientId: { connect: { id: userNew.id } },
          status: Status.ONCART,
        },
      });
    });
  });

  describe('cartDetail', () => {
    it('should retrieve the cart detail', async () => {
      const data = await orderService.cartDetail({
        orderId: orderTest.id,
      });
      const products = await prismaService.orderDetail.findMany({
        where: {
          orderId: orderTest.id,
        },
      });

      expect(products).toHaveLength(data.length);
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
  });
});
