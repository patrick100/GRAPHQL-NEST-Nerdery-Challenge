import { Category, Prisma } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { QueueCollectionDto } from 'src/common/dto/queue-collection.dto';
import { PaginationService } from 'src/common/services/pagination.service';
import { CategoryDto } from './dto/response/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private pagination: PaginationService,
  ) {}

  async categories(params: PaginationQueryDto): Promise<CategoryDto[]> {
    const { skip, take } = this.pagination.paginatedHelper(params);

    const categories = await this.prisma.category.findMany({
      skip: skip,
      take: take,
    });

    return plainToClass(CategoryDto, categories);
  }

  async categoriesPageInfo(params: PaginationQueryDto): Promise<PaginationDto> {
    const { page, perPage } = params;
    const count = await this.prisma.category.count();
    const pageInfo: PaginationDto = this.pagination.paginationSerializer(
      count,
      {
        page,
        perPage,
      },
    );

    return plainToClass(PaginationDto, pageInfo);
  }

  async category(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: categoryWhereUniqueInput,
    });
  }

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async modifyCategory(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    const existCategory = await this.category(categoryWhereUniqueInput);
    if (!existCategory) {
      throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.category.update({
      where: categoryWhereUniqueInput,
      data: data,
    });
  }

  async deleteCategory(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category> {
    const existCategory = await this.category(categoryWhereUniqueInput);
    if (!existCategory) {
      throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.category.delete({ where: categoryWhereUniqueInput });
  }
}
