import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput } from './dto/input/create-category.input';
import { ModifyCategoryInput } from './dto/input/modify-category.input';
import { Category } from './models/category.model';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private categoriesService: CategoriesService) {}

  @Query(() => Category, { name: 'category', nullable: true })
  async category(@Args('uuid') uuid: string): Promise<Category> {
    return this.categoriesService.category({ uuid: uuid });
  }

  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryData') createCategoryData: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryData);
  }

  @Mutation(() => Category)
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
  async deleteCategory(@Args('uuid') uuid: string): Promise<Category> {
    return this.categoriesService.deleteCategory({ uuid: uuid });
  }
}
