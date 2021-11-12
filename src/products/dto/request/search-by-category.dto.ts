import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class SearchByCategoryDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  category?: string;
}
