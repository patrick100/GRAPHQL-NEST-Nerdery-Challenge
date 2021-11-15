import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'prisma/prisma.service';
import { CategoriesService } from 'src/categories/categories.service';
import { Pagination } from 'src/common/models/pagination.model';
import { PaginationService } from 'src/common/services/pagination.service';
import { FilesService } from 'src/files/files.service';
import { OrdersService } from 'src/orders/orders.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { DetailsOrderService } from './details-order.service';

describe('DetailsOrderService', () => {
  let detailsService: DetailsOrderService;
  let categoriesService: CategoriesService;
  let prismaService: PrismaService;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        DetailsOrderService,
        ProductsService,
        OrdersService,
        UsersService,
        FilesService,
        PaginationService,
        CategoriesService,
      ],
    }).compile();

    detailsService = module.get<DetailsOrderService>(DetailsOrderService);
    // categoriesService = module.get<CategoriesService>(CategoriesService);
    // prismaService = module.get<PrismaService>(PrismaService);
    // ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(detailsService).toBeDefined();
  });
});
