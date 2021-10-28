import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly brand: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly categoryId: number;

  @Expose()
  readonly imageUrl: string;

  @Expose()
  readonly measurementUnit: string;

  @Expose()
  readonly unitPrice: number;

  @Expose()
  readonly stock: number;

  @Expose()
  readonly isEnabled: boolean;
}
