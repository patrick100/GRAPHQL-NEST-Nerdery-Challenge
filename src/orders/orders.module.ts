import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CategoriesService } from 'src/categories/categories.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { DetailsOrderService } from 'src/details-order/details-order.service';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { CartsResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

@Module({
  providers: [
    CartsResolver,
    PrismaService,
    UsersService,
    DetailsOrderService,
    OrdersService,
    ProductsService,
    PaginationService,
    CategoriesService,
    OrdersService,
  ],
})
export class OrdersModule {}
