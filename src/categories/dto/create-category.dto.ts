import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsBoolean()
  readonly isEnabled?: boolean;
}
