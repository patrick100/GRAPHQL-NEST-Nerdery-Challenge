import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DetailDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly orderId: number;

  @Expose()
  readonly productId: number;

  @Expose()
  readonly unitPrice: number;

  @Expose()
  readonly quantity: number;

  @Expose()
  readonly subtotal: number;
}
