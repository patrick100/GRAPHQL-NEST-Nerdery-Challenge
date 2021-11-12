import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsPositive, IsUUID } from 'class-validator';

@ObjectType()
export class PaginationQueryModel {
  @Field()
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @Field()
  @IsOptional()
  @IsPositive()
  perPage?: number = 2;

  // @Field()
  // @IsOptional()
  // @IsUUID()
  // category?: string;
}
