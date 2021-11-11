import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class ProductToCartInput {
  // @Field()
  // @IsOptional()
  // @IsString()
  // readonly orderId: string;

  @Field()
  @IsString()
  readonly productId: string;

  @Field()
  @IsInt()
  @IsPositive()
  readonly quantity: number;
}
