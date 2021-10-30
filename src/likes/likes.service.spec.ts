import { Category, LikeProduct, Product, User } from '.prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { CategoryFactory } from 'src/common/factories/category.factory';
import { LikeFactory } from 'src/common/factories/like.factory';
import { ProductFactory } from 'src/common/factories/product.factory';
import { UserFactory } from 'src/common/factories/user.factory';
import { LikesService } from './likes.service';
import * as faker from 'faker';
import { UsersService } from 'src/users/users.service';

describe('LikesService', () => {
  let likeService: LikesService;
  let prisma: PrismaService;
  let categoryFactory: CategoryFactory;
  let productFactory: ProductFactory;
  let userFactory: UserFactory;
  let likeFactory: LikeFactory;
  let userTest: User;
  let categoryTest: Category;
  let productTest: Product;
  let likeTest: LikeProduct;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        PrismaService,
        UsersService,
        UserFactory,
        CategoryFactory,
        ProductFactory,
        LikeFactory,
      ],
    }).compile();

    likeService = module.get<LikesService>(LikesService);
    prisma = module.get<PrismaService>(PrismaService);
    userFactory = module.get<UserFactory>(UserFactory);
    categoryFactory = module.get<CategoryFactory>(CategoryFactory);
    productFactory = module.get<ProductFactory>(ProductFactory);
    likeFactory = module.get<LikeFactory>(LikeFactory);

    userTest = await userFactory.make({});
    categoryTest = await categoryFactory.make({});
    productTest = await productFactory.make({
      category: { connect: { id: categoryTest.id } },
    });
    likeTest = await likeFactory.make({
      user: { connect: { id: userTest.id } },
      product: { connect: { id: productTest.id } },
    });
  });

  afterAll(async () => {
    await prisma.likeProduct.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(likeService).toBeDefined();
  });

  describe('giveLikeProduct', () => {
    it('should throw an error with an invalid productId', async () => {
      const productId = faker.datatype.uuid();

      await expect(
        likeService.giveLikeProduct(userTest.uuid, productId),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw an error with an invalid userId', async () => {
      const userId = faker.datatype.uuid();

      await expect(
        likeService.giveLikeProduct(userId, productTest.uuid),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw an error if the like already exist', async () => {
      await expect(
        likeService.giveLikeProduct(userTest.uuid, productTest.uuid),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('removeLikeProduct', () => {
    it('should throw an error with an invalid productId', async () => {
      const productId = faker.datatype.uuid();

      await expect(
        likeService.removeLikeProduct(userTest.uuid, productId),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw an error with an invalid userId', async () => {
      const userId = faker.datatype.uuid();

      await expect(
        likeService.removeLikeProduct(userId, productTest.uuid),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should not throw an error if the like already exist', async () => {
      await expect(
        likeService.removeLikeProduct(userTest.uuid, productTest.uuid),
      ).resolves.not.toThrow();
    });
  });
});
