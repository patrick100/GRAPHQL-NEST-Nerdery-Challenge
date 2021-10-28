import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Name of the category ' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Description of the category ' })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ description: 'Is the category enabled' })
  @IsOptional()
  @IsBoolean()
  readonly isEnabled?: boolean;
}
