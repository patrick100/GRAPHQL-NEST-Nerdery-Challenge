import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsPositive } from 'class-validator';

@ArgsType()
export class PaginationQueryArgs {
  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  perPage?: number = 2;
}
