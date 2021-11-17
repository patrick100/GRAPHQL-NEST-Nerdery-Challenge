import { Category, Product, User } from '.prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CategoryFactory } from 'src/common/factories/category.factory';
import { ProductFactory } from 'src/common/factories/product.factory';
import { UserFactory } from 'src/common/factories/user.factory';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { FileImageDto } from './dto/response/file-image.dto';
import { FilesService } from './files.service';

jest.mock('aws-sdk', () => {
  class mockS3 {
    getSignedUrlPromise(op, obj) {
      return 'signedUrl';
    }
  }
  return {
    S3: mockS3,
  };
});

describe('FilesService', () => {
  let fileService: FilesService;
  let prisma: PrismaService;
  let categoryFactory: CategoryFactory;
  let productFactory: ProductFactory;
  let userFactory: UserFactory;
  let productTest: Product;
  let userTest: User;
  let categoryTest: Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        FilesService,
        UsersService,
        ProductFactory,
        UserFactory,
        CategoryFactory,
      ],
    }).compile();

    fileService = module.get<FilesService>(FilesService);
    prisma = module.get<PrismaService>(PrismaService);
    productFactory = module.get<ProductFactory>(ProductFactory);
    userFactory = module.get<UserFactory>(UserFactory);
    categoryFactory = module.get<CategoryFactory>(CategoryFactory);

    categoryTest = await categoryFactory.make({});
    productTest = await productFactory.make({
      category: { connect: { id: categoryTest.id } },
    });
    userTest = await userFactory.make({});
  });

  afterAll(async () => {
    await prisma.clearDatabase();
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(fileService).toBeDefined();
  });

  describe('generatePresignedUrl', () => {
    it('should throw an error with an incorrect productId', async () => {
      const productId = faker.datatype.uuid();
      const userId = userTest.uuid;
      await expect(
        fileService.generatePresignedUrl(productId, userId),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw an error with an incorrect userId', async () => {
      const productId = productTest.uuid;
      const userId = faker.datatype.uuid();
      await expect(
        fileService.generatePresignedUrl(productId, userId),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should return a signed url with the correct parameters', async () => {
      const productId = productTest.uuid;
      const userId = userTest.uuid;
      const fileImage: FileImageDto = await fileService.generatePresignedUrl(
        productId,
        userId,
      );
      expect(fileImage.url).toMatch('signedUrl');
    });
  });

  describe('getImagesbyProductId', () => {
    it('should throw an error with an incorrect productId', async () => {
      const productId = faker.datatype.uuid();
      await expect(
        fileService.getImagesbyProductId(productId),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should not throw an error with the correct parameters', async () => {
      const productId = productTest.uuid;
      await expect(
        fileService.getImagesbyProductId(productId),
      ).resolves.not.toThrow();
    });
  });
});
