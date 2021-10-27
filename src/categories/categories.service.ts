import { Category, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { QueueCollectionDto } from 'src/common/dto/queue-collection.dto';
import { PaginationService } from 'src/common/services/pagination.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private pagination: PaginationService,
  ) {}

  async categories(params: PaginationQueryDto): Promise<QueueCollectionDto> {
    const { page, perPage } = params;
    const { skip, take } = this.pagination.paginatedHelper(params);

    const [count, data] = await Promise.all([
      this.prisma.category.count(),

      this.prisma.category.findMany({
        skip: skip,
        take: take,
      }),
    ]);

    const pageInfo: PaginationDto = this.pagination.paginationSerializer(
      count,
      {
        page,
        perPage,
      },
    );

    return plainToClass(QueueCollectionDto, { pageInfo, data });
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
    return this.prisma.category.update({
      where: categoryWhereUniqueInput,
      data: data,
    });
  }

  async deleteCategory(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category> {
    return this.prisma.category.delete({ where: categoryWhereUniqueInput });
  }
}
