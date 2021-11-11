import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryDto } from 'src/categories/dto/response/category.dto';
import { CreateProductInput } from './dto/input/create-product.input';
import { ModifyProductInput } from './dto/input/modify-product.input';
import { ProductDto } from './dto/response/product.dto';
import { Product } from './models/product.model';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private productService: ProductsService,
    private categoryService: CategoriesService,
  ) {}

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
}
