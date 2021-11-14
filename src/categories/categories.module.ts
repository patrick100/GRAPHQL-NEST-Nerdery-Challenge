import { Module } from '@nestjs/common';
import { PaginationService } from 'src/common/services/pagination.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { CategoriesController } from './categories.controller';
import { CategoriesResolver } from './categories.resolver';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesResolver, CategoriesService, PaginationService],
  imports: [PrismaModule, UsersModule],
  exports: [CategoriesService],
})
export class CategoriesModule {}
