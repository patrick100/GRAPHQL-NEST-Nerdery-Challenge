import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from 'src/categories/categories.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { FilesService } from 'src/files/files.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        OrdersService,
        UsersService,
        ProductsService,
        FilesService,
        PaginationService,
        CategoriesService,
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
