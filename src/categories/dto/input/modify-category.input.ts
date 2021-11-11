import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class ModifyCategoryInput {
  @Field()
  @IsOptional()
  @IsString()
  readonly name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly isEnabled?: boolean;
}
