import { Prisma } from '.prisma/client';
import { IsOptional, IsPositive, IsUUID } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  perPage?: number = 2;

  @IsOptional()
  @IsUUID()
  category?: string;
}
