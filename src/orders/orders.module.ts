import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { PaginationService } from 'src/common/services/pagination.service';
import { DetailsOrderModule } from 'src/details-order/details-order.module';
import { FilesService } from 'src/files/files.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  providers: [OrdersResolver, PaginationService, OrdersService, FilesService],
  imports: [
    PrismaModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    DetailsOrderModule,
    OrdersModule,
  ],
  exports: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
