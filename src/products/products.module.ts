import { Module } from '@nestjs/common';
import { CategoriesModule } from 'src/categories/categories.module';
import { PaginationService } from 'src/common/services/pagination.service';
import { FilesService } from 'src/files/files.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { ProductsController } from './products.controller';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsResolver,
    ProductsService,
    PaginationService,
    FilesService,
  ],
  imports: [CategoriesModule, PrismaModule, UsersModule],
  exports: [ProductsService],
})
export class ProductsModule {}
