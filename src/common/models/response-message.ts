import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResponseMessage {
  @Field()
  message: string;

  @Field()
  code: number;
}
