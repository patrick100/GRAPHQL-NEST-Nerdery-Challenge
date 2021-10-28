import { Expose } from 'class-transformer';
import { DetailDto } from './detail.dto';
import { OrderDto } from './order.dto';

export class OrderWithDetailDto {
  @Expose()
  readonly order: OrderDto;

  @Expose()
  readonly detail: DetailDto | null;
}
