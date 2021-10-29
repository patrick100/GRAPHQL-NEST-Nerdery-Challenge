import { Status } from '.prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly userId: number;

  @Expose()
  readonly status: Status;

  @Expose()
  readonly totalPrice: number;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;
}
