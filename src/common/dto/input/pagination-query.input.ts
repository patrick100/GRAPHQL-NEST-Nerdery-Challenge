import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive } from 'class-validator';

@InputType()
export class PaginationQueryInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  perPage?: number = 2;
}
