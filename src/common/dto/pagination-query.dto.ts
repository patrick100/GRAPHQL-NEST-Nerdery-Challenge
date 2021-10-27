import { Prisma } from '.prisma/client';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  offset?: number;

  @IsOptional()
  @IsPositive()
  limit?: number = 20;

  @IsOptional()
  orderBy?: Prisma.CategoryOrderByWithRelationInput;
}
