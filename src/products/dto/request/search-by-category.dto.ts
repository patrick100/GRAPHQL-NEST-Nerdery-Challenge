import { IsOptional, IsUUID } from 'class-validator';

export class SearchByCategoryDto {
  @IsOptional()
  @IsUUID()
  category?: string;
}
