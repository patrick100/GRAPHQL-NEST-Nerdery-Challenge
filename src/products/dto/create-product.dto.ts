import {
  IsString,
  IsOptional,
  IsUrl,
  IsNumber,
  Min,
  IsPositive,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsInt()
  @IsPositive()
  readonly category: number;

  @IsOptional()
  @IsUrl()
  readonly imageUrl: string;

  @IsString()
  readonly measurementUnit: string = 'unit';

  @IsNumber()
  @IsPositive()
  readonly unitPrice: number;

  @IsNumber()
  @Min(0)
  readonly stock?: number;

  @IsOptional()
  @IsBoolean()
  readonly isEnabled?: boolean = true;
}
