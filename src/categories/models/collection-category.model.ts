import { ObjectType } from '@nestjs/graphql';
import { getCollectionDto } from 'src/common/utils/pagination.utils';
import { Category } from './category.model';

@ObjectType('CollectionCategoryModel')
export class CollectionCategoryModel extends getCollectionDto(Category) {}
