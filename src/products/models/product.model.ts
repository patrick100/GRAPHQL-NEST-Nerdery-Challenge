import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/categories/models/category.model';

@ObjectType()
export class Product {
  @Field()
  readonly uuid: string;

  @Field()
  readonly name: string;

  @Field()
  readonly brand: string;

  @Field({ nullable: true })
  readonly description: string;

  @Field((type) => Category, { nullable: true })
  category: Category;

  @Field((type) => Int)
  categoryId: number;

  @Field({ nullable: true })
  readonly measurementUnit: string;

  @Field((type) => Float)
  readonly unitPrice: number;

  @Field((type) => Int)
  readonly stock: number;

  @Field({ nullable: true })
  readonly isEnabled: boolean;
}
