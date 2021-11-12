import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { UsersService } from 'src/users/users.service';
import { CategoriesController } from './categories.controller';
import { CategoriesResolver } from './categories.resolver';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesResolver,
    CategoriesService,
    PrismaService,
    PaginationService,
    UsersService,
  ],
})
export class CategoriesModule {}
