import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class ProductToCartDto {
  @IsOptional()
  @IsString()
  readonly orderId: string;

  @IsString()
  readonly productId: string;

  @IsInt()
  @IsPositive()
  readonly quantity: number;
}
