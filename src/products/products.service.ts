import { Category, Prisma, Product } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/request/create-product.dto';
import { ModifyProductDto } from './dto/request/modify-product.dto';
import { _ } from 'lodash';
import { PaginationService } from '../common/services/pagination.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { plainToClass } from 'class-transformer';
import { CategoriesService } from 'src/categories/categories.service';
import { SearchByCategoryInput } from './dto/input/search-by-category.input';
import { ProductDto } from './dto/response/product.dto';
import { CollectionProductModel } from './models/collection-product.model';
import { PaginationSearchByCategoryDto } from './dto/request/pagination-search-by-category.dto';
import userInfoEmail from 'src/common/interfaces/user-emai.interface';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private pagination: PaginationService,
    private categoryService: CategoriesService,
  ) {}

  async collectionProducts(
    params: PaginationQueryDto,
    categoryData: SearchByCategoryInput,
  ): Promise<CollectionProductModel> {
    const edges = await this.products(params, categoryData);
    const pageInfo = await this.productsPageInfo(params, categoryData);

    return { edges, pageInfo };
  }

  async collectionProductsForController(
    params: PaginationSearchByCategoryDto,
  ): Promise<CollectionProductModel> {
    const { category: categoryData } = params;
    const edges = await this.products(params, { categoryUuid: categoryData });
    const pageInfo = await this.productsPageInfo(params, {
      categoryUuid: categoryData,
    });

    return { edges, pageInfo };
  }

  async products(
    params: PaginationQueryDto,
    categoryData: SearchByCategoryInput,
  ): Promise<ProductDto[]> {
    const { categoryUuid } = categoryData;
    const { skip, take } = this.pagination.paginatedHelper(params);

    let products: Product[];

    // find categoryId
    if (categoryUuid) {
      const categoryRetrieve = await this.categoryService.category({
        uuid: categoryUuid,
      });
      products = await this.prisma.product.findMany({
        skip: skip,
        take: take,
        where: {
          categoryId: categoryRetrieve.id,
        },
      });
    } else {
      products = await this.prisma.product.findMany({
        skip: skip,
        take: take,
      });
    }

    return plainToClass(ProductDto, products);
  }

  async productsPageInfo(
    params: PaginationQueryDto,
    categoryData: SearchByCategoryInput,
  ): Promise<PaginationDto> {
    const { categoryUuid } = categoryData;
    const { page, perPage } = params;
    let count: number;

    if (categoryUuid) {
      const categoryRetrieve = await this.categoryService.category({
        uuid: categoryUuid,
      });

      count = await this.prisma.product.count({
        where: {
          categoryId: categoryRetrieve.id,
        },
      });
    } else {
      count = await this.prisma.product.count({});
    }

    const pageInfo: PaginationDto = this.pagination.paginationSerializer(
      count,
      {
        page,
        perPage,
      },
    );

    return plainToClass(PaginationDto, pageInfo);
  }

  async product(
    productWhereUniqueInput: Prisma.ProductWhereUniqueInput,
  ): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    }

    return plainToClass(ProductDto, product);
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const { id } = await this.categoryService.category({
      uuid: productData.categoryUuid,
    });

    const newProductData = _.omit(productData, ['categoryUuid']);

    const data: Prisma.ProductCreateInput = {
      ...newProductData,
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

    if (productData.categoryUuid) {
      category = await this.categoryService.category({
        uuid: productData.categoryUuid,
      });
      if (!category) {
        throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
      }
    }

    return this.prisma.product.update({
      where: productWhereUniqueInput,
      data: {
        ...productData,
        category: { connect: { uuid: category.uuid } },
      },
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

  async usersWhoLikedProduct(productId: number): Promise<userInfoEmail[]> {
    const users = await this.prisma.likeProduct.findMany({
      where: {
        productId: productId,
      },
      select: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return users;
  }
}
