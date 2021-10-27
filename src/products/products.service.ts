import { Prisma, Product } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/request/create-product.dto';
import { ModifyProductDto } from './dto/request/modify-product.dto';
import { _ } from 'lodash';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async products(params: PaginationQueryDto): Promise<Product[]> {
    const { offset, limit, orderBy } = params;
    return this.prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy,
    });
  }

  async product(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const data: Prisma.ProductCreateInput = {
      ...productData,
      category: { connect: { id: productData.category } },
    };
    return this.prisma.product.create({
      data,
    });
  }

  async modifyProduct(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
    productData: ModifyProductDto,
  ): Promise<Product> {
    let data: Prisma.ProductUpdateInput;
    if (productData.category) {
      data = {
        ...productData,
        category: { connect: { id: productData.category } },
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
