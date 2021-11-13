import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class SearchByCategoryDto {
  @Field()
  @IsOptional()
  @IsUUID()
  categoryUuid?: string;
}
