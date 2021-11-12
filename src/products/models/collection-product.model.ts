import { Field, ObjectType } from '@nestjs/graphql';
import { Pagination } from 'src/common/models/pagination.model';
import { ProductDto } from '../dto/response/product.dto';
import { Product } from './product.model';

@ObjectType()
export class CollectionProductModel {
  @Field((type) => [Product])
  products: ProductDto[];

  @Field(() => Pagination)
  pageInfo: Pagination;
}
