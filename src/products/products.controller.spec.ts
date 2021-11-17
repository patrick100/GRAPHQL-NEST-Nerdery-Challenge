import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from 'src/categories/categories.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { FilesService } from 'src/common/files/files.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ProductsController],
      providers: [
        UsersService,
        ProductsService,
        PaginationService,
        CategoriesService,
        FilesService,
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
