import { Category, Prisma } from '.prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CategoryFactory } from 'src/common/factories/category.factory';
import { PaginationService } from 'src/common/services/pagination.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { CategoriesService } from './categories.service';
import { CollectionCategoryModel } from './models/collection-category.model';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let prismaService: PrismaService;
  let categoryFactory: CategoryFactory;
  let categoryTest: Category;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [CategoriesService, PaginationService, CategoryFactory],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);
    categoryFactory = module.get<CategoryFactory>(CategoryFactory);

    categoryTest = await categoryFactory.make({});
    await categoryFactory.makeMany(5, {});
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('category', () => {
    it('should return a category info', async () => {
      const category = await categoriesService.category({
        uuid: categoryTest.uuid,
      });

      expect(category).toEqual(categoryTest);
    });
  });

  describe('categories', () => {
    it('should return a list of categories', async () => {
      const data: CollectionCategoryModel =
        await categoriesService.collectionCategories({
          page: 1,
          perPage: 1,
        });
      const categories = await prismaService.category.findMany({});

      expect(categories).toHaveLength(Number(data.pageInfo.total));
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const spy = jest.spyOn(prismaService.category, 'create');
      const data: Prisma.CategoryCreateInput = { name: 'New Category' };

      await categoriesService.createCategory(data);

      expect(spy).toBeCalledWith({
        data: {
          name: 'New Category',
        },
      });
    });
  });

  describe('modifyCategory', () => {
    it('should modify a category', async () => {
      const data: Partial<Category> = { name: 'Modify Name Category' };

      await expect(
        categoriesService.modifyCategory({ uuid: categoryTest.uuid }, data),
      ).resolves.toEqual({
        ...categoryTest,
        ...data,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('deleteCategory', () => {
    it('should delete the category', async () => {
      const spy = jest.spyOn(prismaService.category, 'delete');
      const tempUuid = categoryTest.uuid;

      await categoriesService.deleteCategory({ uuid: categoryTest.uuid });

      expect(spy).toBeCalledWith({
        where: {
          uuid: tempUuid,
        },
      });
    });
  });
});
