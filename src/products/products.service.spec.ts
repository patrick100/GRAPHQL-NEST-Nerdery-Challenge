import { Category, Product } from '.prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryFactory } from 'src/common/factories/category.factory';
import { ProductFactory } from 'src/common/factories/product.factory';
import { PaginationService } from 'src/common/services/pagination.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsService } from './products.service';
import * as faker from 'faker';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { CollectionProductModel } from './models/collection-product.model';

describe('ProductsService', () => {
  let prismaService: PrismaService;
  let productService: ProductsService;
  let categoryFactory: CategoryFactory;
  let productFactory: ProductFactory;
  let categoryTest: Category;
  let productTest: Product;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        PaginationService,
        CategoriesService,
        CategoryFactory,
        ProductFactory,
        ProductsService,
      ],
    }).compile();

    productService = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
    categoryFactory = module.get<CategoryFactory>(CategoryFactory);
    productFactory = module.get<ProductFactory>(ProductFactory);

    categoryTest = await categoryFactory.make({});
    productTest = await productFactory.make({
      category: { connect: { id: categoryTest.id } },
    });
  });

  afterAll(async () => {
    // await prismaService.clearDatabase();
    await prismaService.$disconnect();
    // await module.close();
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('products', () => {
    it('should return a list of products', async () => {
      const data: CollectionProductModel =
        await productService.collectionProducts(
          {
            page: 1,
            perPage: 1,
          },
          {},
        );
      const products = await prismaService.product.findMany({});

      expect(products).toHaveLength(Number(data.pageInfo.total));
    });
  });

  describe('product', () => {
    it('should throw an exception if product doesnt exist', async () => {
      await expect(
        productService.product({ uuid: faker.datatype.uuid() }),
      ).rejects.toThrowError(
        new HttpException('Product Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should return a product info', async () => {
      const product = await productService.product({
        uuid: productTest.uuid,
      });

      expect(product).toEqual(productTest);
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const spy = jest.spyOn(prismaService.product, 'create');
      const data: CreateProductDto = {
        name: 'New Product',
        brand: 'The Brand',
        categoryUuid: categoryTest.uuid,
        unitPrice: 10,
        measurementUnit: 'unit',
      };

      await productService.createProduct(data);

      expect(spy).toBeCalledWith({
        data: {
          ...data,
          category: { connect: { id: categoryTest.id } },
        },
      });
    });
  });

  describe('modifyProduct', () => {
    const data = {
      name: 'New Name Product',
      brand: 'The New Brand',
    };

    it('should throw an exception if product doesnt exist', async () => {
      await expect(
        productService.modifyProduct({ uuid: faker.datatype.uuid() }, data),
      ).rejects.toThrowError(
        new HttpException('Product Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if category doesnt exist', async () => {
      await expect(
        productService.modifyProduct(
          { uuid: productTest.uuid },
          { categoryUuid: faker.datatype.uuid() },
        ),
      ).rejects.toThrowError(
        new HttpException('Category Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should modify a product', async () => {
      await expect(
        productService.modifyProduct({ uuid: productTest.uuid }, data),
      ).resolves.toEqual({
        ...productTest,
        ...data,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('enableProduct', () => {
    it('should throw an exception if product doesnt exist', async () => {
      await expect(
        productService.enableProduct({ uuid: faker.datatype.uuid() }),
      ).rejects.toThrowError(
        new HttpException('Product Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should enable a product', async () => {
      const productChange = await productFactory.make({
        isEnabled: false,
        category: { connect: { id: categoryTest.id } },
      });
      await expect(
        productService.enableProduct({ uuid: productChange.uuid }),
      ).resolves.toEqual({
        ...productChange,
        isEnabled: true,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('disableProduct', () => {
    it('should throw an exception if product doesnt exist', async () => {
      await expect(
        productService.disableProduct({ uuid: faker.datatype.uuid() }),
      ).rejects.toThrowError(
        new HttpException('Product Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should enable a product', async () => {
      const productChange = await productFactory.make({
        isEnabled: true,
        category: { connect: { id: categoryTest.id } },
      });
      await expect(
        productService.disableProduct({ uuid: productChange.uuid }),
      ).resolves.toEqual({
        ...productChange,
        isEnabled: false,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('deleteCategory', () => {
    it('should throw an exception if product doesnt exist', async () => {
      await expect(
        productService.deleteProduct({ uuid: faker.datatype.uuid() }),
      ).rejects.toThrowError(
        new HttpException('Product Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should delete the product', async () => {
      const spy = jest.spyOn(prismaService.product, 'delete');
      const tempUuid = productTest.uuid;

      await productService.deleteProduct({ uuid: productTest.uuid });

      expect(spy).toBeCalledWith({
        where: {
          uuid: tempUuid,
        },
      });
    });
  });
});
