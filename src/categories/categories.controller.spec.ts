import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from 'src/common/services/pagination.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [CategoriesController],
      providers: [UsersService, CategoriesService, PaginationService],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
