import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CategoriesService } from 'src/categories/categories.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    PaginationService,
    CategoriesService,
    UsersService,
    FilesService,
  ],
})
export class ProductsModule {}
