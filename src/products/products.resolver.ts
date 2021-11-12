import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryDto } from 'src/categories/dto/response/category.dto';
import { PaginationQueryInput } from 'src/common/dto/input/pagination-query.input';
import { CreateProductInput } from './dto/input/create-product.input';
import { ModifyProductInput } from './dto/input/modify-product.input';
import { SearchByCategoryDto } from './dto/request/search-by-category.dto';
import { ProductDto } from './dto/response/product.dto';
import { CollectionProductModel } from './models/collection-product.model';
import { Product } from './models/product.model';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private productService: ProductsService,
    private categoryService: CategoriesService,
  ) {}

  @Query(() => CollectionProductModel, { name: 'products', nullable: true })
  async products(
    @Args('paginationQuery') paginationQuery: PaginationQueryInput,
    @Args('searchByCategory', { nullable: true })
    searchByCategory: SearchByCategoryDto,
  ): Promise<CollectionProductModel> {
    const products = await this.productService.products(
      paginationQuery,
      searchByCategory,
    );
    const pageInfo = await this.productService.productsPageInfo(
      paginationQuery,
      searchByCategory,
    );

    return { products, pageInfo };
  }

  @Query(() => Product, { name: 'product', nullable: true })
  async product(@Args('uuid') uuid: string): Promise<ProductDto> {
    return this.productService.product({ uuid: uuid });
  }

  @ResolveField()
  async category(@Parent() product: Product): Promise<CategoryDto> {
    return this.categoryService.category({ id: product.categoryId });
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, ManagerGuard)
  async createProduct(
    @Args('createProductData') createProductData: CreateProductInput,
  ): Promise<CategoryDto> {
    return this.productService.createProduct(createProductData);
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, ManagerGuard)
  async modifyProduct(
    @Args('uuid') uuid: string,
    @Args('modifyProductData') modifyProductData: ModifyProductInput,
  ): Promise<CategoryDto> {
    return this.productService.modifyProduct({ uuid: uuid }, modifyProductData);
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, ManagerGuard)
  async enableProduct(@Args('uuid') uuid: string): Promise<CategoryDto> {
    return this.productService.enableProduct({ uuid: uuid });
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, ManagerGuard)
  async disableProduct(@Args('uuid') uuid: string): Promise<CategoryDto> {
    return this.productService.disableProduct({ uuid: uuid });
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, ManagerGuard)
  async deleteProduct(@Args('uuid') uuid: string): Promise<CategoryDto> {
    return this.productService.deleteProduct({ uuid: uuid });
  }
}
