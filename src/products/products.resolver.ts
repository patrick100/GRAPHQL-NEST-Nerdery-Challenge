import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryDto } from 'src/categories/dto/response/category.dto';
import { PaginationQueryInput } from 'src/common/dto/input/pagination-query.input';
import { FilesService } from 'src/files/files.service';
import { FileImage } from 'src/files/models/file-image';
import TokenPayload from 'src/interfaces/token-payload.interface';
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
    private fileService: FilesService,
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
  async createProduct(
    @Args('createProductData') createProductData: CreateProductInput,
  ): Promise<CategoryDto> {
    return this.productService.createProduct(createProductData);
  }

  @Mutation(() => Product)
  async modifyProduct(
    @Args('uuid') uuid: string,
    @Args('modifyProductData') modifyProductData: ModifyProductInput,
  ): Promise<CategoryDto> {
    return this.productService.modifyProduct({ uuid: uuid }, modifyProductData);
  }

  @Mutation(() => Product)
  async enableProduct(@Args('uuid') uuid: string): Promise<CategoryDto> {
    return this.productService.enableProduct({ uuid: uuid });
  }

  @Mutation(() => Product)
  async disableProduct(@Args('uuid') uuid: string): Promise<CategoryDto> {
    return this.productService.disableProduct({ uuid: uuid });
  }

  @Mutation(() => Product)
  async deleteProduct(@Args('uuid') uuid: string): Promise<CategoryDto> {
    return this.productService.deleteProduct({ uuid: uuid });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => FileImage)
  async uploadImgProduct(
    @CurrentUser() user: TokenPayload,
    @Args('uuid') uuid: string,
  ): Promise<FileImage> {
    return this.fileService.generatePresignedUrl(uuid, user.uuid);
  }

  @Query(() => [FileImage])
  async getImagesProduct(@Args('uuid') uuid: string): Promise<FileImage[]> {
    return this.fileService.getImagesbyProductId(uuid);
  }
}
