import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CategoriesService } from 'src/categories/categories.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { DetailsOrderService } from './details-order.service';
import { DetailsResolver } from './details.resolver';

@Module({
  providers: [
    DetailsResolver,
    PrismaService,
    DetailsOrderService,
    DetailsResolver,
    ProductsService,
    PaginationService,
    CategoriesService,
    UsersService,
    OrdersService,
  ],
})
export class DetailsOrderModule {}
