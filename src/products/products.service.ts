import { Category, Prisma, Product } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    private categoryService: CategoriesService,
  ) {}

  async products(params: PaginationQueryDto): Promise<QueueCollectionDto> {
    const { page, perPage, category } = params;
    const { skip, take } = this.pagination.paginatedHelper(params);

    let count: number;
    let data: Product[];

    // find categoryId
    if (category) {
      const categoryRetrieve = await this.categoryService.category({
        uuid: category,
      });
      [count, data] = await Promise.all([
        this.prisma.product.count({
          where: {
            categoryId: categoryRetrieve.id,
          },
        }),

        this.prisma.product.findMany({
          skip: skip,
          take: take,
          where: {
            categoryId: categoryRetrieve.id,
          },
        }),
      ]);
    } else {
      [count, data] = await Promise.all([
        this.prisma.product.count({}),

        this.prisma.product.findMany({
          skip: skip,
          take: take,
        }),
      ]);
    }

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
    const product = await this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const { id } = await this.categoryService.category({
      uuid: productData.category,
    });

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
    const product = await this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    }

    let category: Category;

    if (productData.category) {
      category = await this.categoryService.category({
        uuid: productData.category,
      });
      if (!category) {
        throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
      }
    }

    let data: Prisma.ProductUpdateInput;
    if (productData.category) {
      data = {
        ...productData,
        category: { connect: { id: category.id } },
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
    // product exists?
    const product = await this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    }

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
    // product exists?
    const product = await this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    }

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
    // product exists?
    const product = await this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.product.delete({ where: productWhereUniqueInput });
  }
}
