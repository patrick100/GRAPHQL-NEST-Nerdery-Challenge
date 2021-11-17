import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class SearchByCategoryInput {
  @Field()
  @IsOptional()
  @IsUUID()
  categoryUuid?: string;
}
