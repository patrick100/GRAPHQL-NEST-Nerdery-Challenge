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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryDto } from 'src/categories/dto/response/category.dto';
import { FilesService } from 'src/common/files/files.service';
import { FileImage } from 'src/common/files/models/file-image';
import TokenPayload from 'src/common/interfaces/token-payload.interface';
import { CreateProductInput } from './dto/input/create-product.input';
import { ModifyProductInput } from './dto/input/modify-product.input';
import { SearchByCategoryInput } from './dto/input/search-by-category.input';
import { ProductDto } from './dto/response/product.dto';
import { CollectionProductModel } from './models/collection-product.model';
import { Product } from './models/product.model';
import { ProductsService } from './products.service';
import { PaginationQueryInput } from 'src/common/dto/input/pagination-query.input';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private productService: ProductsService,
    private categoryService: CategoriesService,
    private fileService: FilesService,
  ) {}

  @Query(() => CollectionProductModel, { name: 'products', nullable: true })
  async products(
    @Args('pagination') paginationQuery: PaginationQueryInput,
    @Args('category', { nullable: true })
    searchByCategory: SearchByCategoryInput,
  ): Promise<CollectionProductModel> {
    return this.productService.collectionProducts(
      paginationQuery,
      searchByCategory,
    );
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

  @UseGuards(GqlAuthGuard, ManagerGuard)
  @Mutation(() => FileImage)
  async getSignedUrlProduct(
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
