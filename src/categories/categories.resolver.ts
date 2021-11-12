import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';
import { PaginationQueryInput } from 'src/common/dto/input/pagination-query.input';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput } from './dto/input/create-category.input';
import { ModifyCategoryInput } from './dto/input/modify-category.input';
import { CategoryDto } from './dto/response/category.dto';
import { Category } from './models/category.model';
import { CollectionCategoryModel } from './models/collection-category.model';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private categoriesService: CategoriesService) {}

  @Query(() => CollectionCategoryModel, { name: 'categories', nullable: true })
  async categories(
    @Args('paginationQuery') paginationQuery: PaginationQueryInput,
  ): Promise<CollectionCategoryModel> {
    const categories = await this.categoriesService.categories(paginationQuery);
    const pageInfo = await this.categoriesService.categoriesPageInfo(
      paginationQuery,
    );
    return { categories, pageInfo };
  }

  @Query(() => Category, { name: 'category', nullable: true })
  async category(@Args('uuid') uuid: string): Promise<Category> {
    return this.categoriesService.category({ uuid: uuid });
  }

  @Mutation(() => Category)
  @UseGuards(GqlAuthGuard, ManagerGuard)
  async createCategory(
    @Args('createCategoryData') createCategoryData: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryData);
  }

  @Mutation(() => Category)
  @UseGuards(GqlAuthGuard, ManagerGuard)
  async modifyCategory(
    @Args('uuid') uuid: string,
    @Args('modifyCategoryData') modifyCategoryData: ModifyCategoryInput,
  ): Promise<Category> {
    return this.categoriesService.modifyCategory(
      { uuid: uuid },
      modifyCategoryData,
    );
  }

  @Mutation(() => Category)
  @UseGuards(GqlAuthGuard, ManagerGuard)
  async deleteCategory(@Args('uuid') uuid: string): Promise<Category> {
    return this.categoriesService.deleteCategory({ uuid: uuid });
  }
}
