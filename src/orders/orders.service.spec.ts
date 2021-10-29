import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { OrdersService } from './orders.service';
import * as faker from 'faker';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Order, Status, User } from '.prisma/client';
import { UserFactory } from 'src/common/factories/user.factory';
import { OrderFactory } from 'src/common/factories/order.factory';

describe('OrdersService', () => {
  let orderService: OrdersService;
  let userService: UsersService;
  let prismaService: PrismaService;
  let orderFactory: OrderFactory;

  let order: Order;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [OrdersService, UsersService, OrderFactory],
    }).compile();

    orderService = module.get<OrdersService>(OrdersService);
    userService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    orderFactory = module.get<OrderFactory>(OrderFactory);

    order = await orderFactory.make({ status: Status.ONCART });
  });

  // afterAll(async () => {
  //   await prismaService.clearDatabase();
  //   await prismaService.$disconnect();
  //   await module.close();
  // });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  // describe('user', () => {
  //   it('should throw an exception if user doesnt exist', async () => {
  //     await expect(
  //       userService.user({ uuid: faker.datatype.uuid() }),
  //     ).rejects.toThrowError(
  //       new HttpException('User Not Found', HttpStatus.NOT_FOUND),
  //     );
  //   });

  //   it('should create a new user', async () => {
  //     await expect(userService.user())
  //   });
  // });

  describe('order', () => {
    it('should throw an exception if order doesnt exist', async () => {
      await expect(
        orderService.order({ uuid: faker.datatype.uuid() }),
      ).rejects.toThrowError(
        new HttpException('Order Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should retrieve an order info', async () => {
      await expect(
        orderService.order({ uuid: '6576dbfe-452f-40c2-b31b-269fbed3395e' }),
      ).resolves.toMatchInlineSnapshot(`
              Object {
                "createdAt": 2021-10-29T00:12:37.258Z,
                "id": 2,
                "status": "ORDERED",
                "totalPrice": 149,
                "updatedAt": 2021-10-29T00:12:37.259Z,
                "userId": 2,
                "uuid": "6576dbfe-452f-40c2-b31b-269fbed3395e",
              }
            `);
    });
  });
});
