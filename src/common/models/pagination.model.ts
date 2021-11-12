import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Pagination {
  @Field((type) => Int)
  readonly perPage: number;

  @Field((type) => Int, { nullable: true })
  readonly page: number;

  @Field((type) => Int, { nullable: true })
  readonly prevPage: number;

  @Field((type) => Int, { nullable: true })
  readonly nextPage: number;

  @Field((type) => Int, { nullable: true })
  readonly totalPages: number;
}
