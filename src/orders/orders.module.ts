import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { PaginationService } from 'src/common/services/pagination.service';
import { DetailsOrderService } from 'src/details-order/details-order.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { CartsResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

@Module({
  providers: [
    CartsResolver,
    DetailsOrderService,
    OrdersService,
    PaginationService,
    OrdersService,
  ],
  imports: [PrismaModule, UsersModule, ProductsModule, CategoriesModule],
})
export class OrdersModule {}
