import { ObjectType } from '@nestjs/graphql';
import { getCollectionDto } from 'src/utils/pagination.utils';
import { Category } from './category.model';

@ObjectType('CollectionCategoryModel')
export class CollectionCategoryModel extends getCollectionDto(Category) {}
