import { ObjectType } from '@nestjs/graphql';
import { getCollectionDto } from 'src/utils/pagination.utils';
import { Product } from './product.model';

@ObjectType('CollectionProductModel')
export class CollectionProductModel extends getCollectionDto(Product) {}
