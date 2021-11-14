import { forwardRef, Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { PaginationService } from 'src/common/services/pagination.service';
import { OrdersService } from 'src/orders/orders.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { DetailsOrderService } from './details-order.service';
import { DetailsResolver } from './details.resolver';

@Module({
  providers: [
    DetailsResolver,
    DetailsOrderService,
    PaginationService,
    OrdersService,
  ],
  exports: [DetailsOrderService],
  imports: [PrismaModule, ProductsModule, CategoriesModule, UsersModule],
})
export class DetailsOrderModule {}
