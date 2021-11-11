import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  brand: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsString()
  category: string;

  /* eslint-disable*/
  @Field({ nullable: true })
  @IsString()
  measurementUnit: string = 'unit';
  /* eslint-enable */

  @Field()
  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  stock?: number = 0;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean = true;
}
