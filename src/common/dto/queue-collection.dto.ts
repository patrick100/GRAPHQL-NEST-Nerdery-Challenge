import { Exclude, Expose } from 'class-transformer';
import { ProductDto } from 'src/products/dto/response/product.dto';
import { PaginationDto } from './pagination.dto';

@Exclude()
export class QueueCollectionDto {
  @Expose()
  pageInfo: PaginationDto;

  @Expose()
  data: ProductDto;
}
