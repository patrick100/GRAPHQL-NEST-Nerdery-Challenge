import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { QueueCollectionDto } from 'src/common/dto/queue-collection.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { ModifyCategoryDto } from './dto/request/modify-category.dto';
import { CategoryDto } from './dto/response/category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}
  @Get()
  async categories(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<QueueCollectionDto> {
    const categories = await this.categoryService.categories(paginationQuery);

    return categories;
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @HttpCode(201)
  @Post()
  async createCategory(
    @Body() categoryData: CreateCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.categoryService.createCategory(categoryData);

    return plainToClass(CategoryDto, category);
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Patch(':categoryId')
  async modifyCategory(
    @Param('categoryId') categoryId: string,
    @Body() categoryData: ModifyCategoryDto,
  ): Promise<CategoryDto> {
    const category = await this.categoryService.modifyCategory(
      { uuid: categoryId },
      categoryData,
    );

    return plainToClass(CategoryDto, category);
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @HttpCode(204)
  @Delete(':categoryId')
  async deleteCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<CategoryDto> {
    const category = await this.categoryService.deleteCategory({
      uuid: categoryId,
    });

    return plainToClass(CategoryDto, category);
  }
}
