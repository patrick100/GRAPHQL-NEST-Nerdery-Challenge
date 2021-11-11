import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/products/models/product.model';

@ObjectType()
export class Detail {
  @Field()
  readonly uuid: string;

  @Field()
  readonly orderId: number;

  @Field()
  readonly productId: number;

  @Field((type) => Product, { nullable: true })
  product: Product;

  @Field({ nullable: true })
  readonly unitPrice: number;

  @Field()
  readonly quantity: number;

  @Field({ nullable: true })
  readonly subtotal: number;
}
