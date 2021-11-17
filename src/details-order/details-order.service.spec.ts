import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { DetailsOrderService } from './details-order.service';
import { UserFactory } from 'src/common/factories/user.factory';
import { Category, Order, Product, Status, User } from '.prisma/client';
import { OrderDetailFactory } from 'src/common/factories/order-detail.factory';
import { ProductFactory } from 'src/common/factories/product.factory';
import { CategoryFactory } from 'src/common/factories/category.factory';
import { OrderFactory } from 'src/common/factories/order.factory';

describe('DetailsOrderService', () => {
  let detailsService: DetailsOrderService;

  let userFactory: UserFactory;
  let orderDetailFactory: OrderDetailFactory;
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;
  let orderFactory: OrderFactory;

  let userTest: User;
  let orderTest: Order;
  let productTest: Product;
  let categoryTest: Category;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        DetailsOrderService,
        UserFactory,
        OrderDetailFactory,
        ProductFactory,
        CategoryFactory,
        OrderFactory,
      ],
    }).compile();

    detailsService = module.get<DetailsOrderService>(DetailsOrderService);
    userFactory = module.get<UserFactory>(UserFactory);
    orderDetailFactory = module.get<OrderDetailFactory>(OrderDetailFactory);
    productFactory = module.get<ProductFactory>(ProductFactory);
    categoryFactory = module.get<CategoryFactory>(CategoryFactory);
    orderFactory = module.get<OrderFactory>(OrderFactory);

    userTest = await userFactory.make({});
    orderTest = await orderFactory.make({
      status: Status.ONCART,
      clientId: { connect: { id: userTest.id } },
    });
    categoryTest = await categoryFactory.make({});
    productTest = await productFactory.make({
      category: { connect: { id: categoryTest.id } },
    });
    await orderDetailFactory.make({
      order: { connect: { id: orderTest.id } },
      product: { connect: { id: productTest.id } },
    });
  });

  it('should be defined', () => {
    expect(detailsService).toBeDefined();
  });

  describe('details', () => {
    it('should retrieve a list of orders from user ID', async () => {
      const details = await detailsService.details({ id: userTest.id });

      details.forEach((element) => {
        expect(element.id).toBe(userTest.id);
      });
    });
  });
});
