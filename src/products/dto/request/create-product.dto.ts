import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Name of the brand' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ description: 'Description of the product' })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ description: 'uuid of the category of the product' })
  @IsString()
  readonly category: string;

  @ApiProperty({ description: 'Measurement unit of the product' })
  @IsString()
  readonly measurementUnit: string = 'unit';

  @ApiProperty({ description: 'Unit price of the product ' })
  @IsNumber()
  @IsPositive()
  readonly unitPrice: number;

  @ApiProperty({ description: 'Current stock of the product' })
  @IsNumber()
  @Min(0)
  readonly stock?: number;

  @ApiProperty({ description: 'Is the product enabled?' })
  @IsOptional()
  @IsBoolean()
  readonly isEnabled?: boolean = true;
}
