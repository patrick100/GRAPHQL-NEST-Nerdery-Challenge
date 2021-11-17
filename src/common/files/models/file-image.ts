import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileImage {
  @Field()
  uuid: string;

  @Field()
  productId: string;

  @Field()
  key: string;

  @Field()
  url: string;
}
