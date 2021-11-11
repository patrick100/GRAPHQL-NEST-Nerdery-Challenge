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
export class ModifyProductInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  brand: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category: string;

  /* eslint-disable*/
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  measurementUnit: string = 'unit';
  /* eslint-enable */

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number = 0;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean = true;
}
