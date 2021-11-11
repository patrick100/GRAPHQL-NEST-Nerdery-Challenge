import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CategoriesService } from 'src/categories/categories.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { DetailsOrderService } from 'src/details-order/details-order.service';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { CartsResolver } from './carts.resolver';
import { CartsService } from './carts.service';

@Module({
  providers: [
    CartsResolver,
    PrismaService,
    UsersService,
    DetailsOrderService,
    CartsService,
    ProductsService,
    PaginationService,
    CategoriesService,
  ],
})
export class CartsModule {}
