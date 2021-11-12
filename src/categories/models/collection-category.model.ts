import { Field, ObjectType } from '@nestjs/graphql';
import { Pagination } from 'src/common/models/pagination.model';
import { Category } from './category.model';

@ObjectType()
export class CollectionCategoryModel {
  @Field((type) => [Category])
  categories: Category[];

  @Field(() => Pagination)
  pageInfo: Pagination;
}
