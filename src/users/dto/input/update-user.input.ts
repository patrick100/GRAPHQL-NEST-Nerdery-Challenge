import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field()
  @IsNotEmpty()
  uuid: string;

  @Field()
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly lastName?: string;
}
