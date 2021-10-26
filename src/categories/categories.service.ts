import { Category, Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async category(params: PaginationQueryDto): Promise<Category[]> {
    const { offset, limit, orderBy } = params;
    return this.prisma.category.findMany({
      skip: offset,
      take: limit,
      orderBy,
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
