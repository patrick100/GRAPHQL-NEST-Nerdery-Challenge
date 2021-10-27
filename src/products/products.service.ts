import { Prisma, Product } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/request/create-product.dto';
import { ModifyProductDto } from './dto/request/modify-product.dto';
import { _ } from 'lodash';
import { PaginationService } from '../common/services/pagination.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { QueueCollectionDto } from 'src/common/dto/queue-collection.dto';
import { plainToClass } from 'class-transformer';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private pagination: PaginationService,
    private category: CategoriesService,
  ) {}

  async products(params: PaginationQueryDto): Promise<QueueCollectionDto> {
    const { page, perPage } = params;
    const { skip, take } = this.pagination.paginatedHelper(params);

    const [count, data] = await Promise.all([
      this.prisma.product.count(),

      this.prisma.product.findMany({
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

  async product(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const { id } = await this.category.category({ uuid: productData.category });

    const data: Prisma.ProductCreateInput = {
      ...productData,
      category: { connect: { id: id } },
    };
    return this.prisma.product.create({
      data,
    });
  }

  async modifyProduct(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
    productData: ModifyProductDto,
  ): Promise<Product> {
    const { id } = await this.category.category({ uuid: productData.category });

    let data: Prisma.ProductUpdateInput;
    if (productData.category) {
      data = {
        ...productData,
        category: { connect: { id: id } },
      };
    } else {
      data = _.omit(productData, ['category']);
    }

    return this.prisma.product.update({
      where: productWhereUniqueInput,
      data: data,
    });
  }

  async enableProduct(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<Product> {
    const data: Prisma.ProductUpdateInput = {
      isEnabled: true,
    };

    return this.prisma.product.update({
      where: productWhereUniqueInput,
      data: data,
    });
  }

  async disableProduct(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<Product> {
    const data: Prisma.ProductUpdateInput = {
      isEnabled: false,
    };

    return this.prisma.product.update({
      where: productWhereUniqueInput,
      data: data,
    });
  }

  async deleteProduct(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<Product> {
    return this.prisma.product.delete({ where: productWhereUniqueInput });
  }
}
