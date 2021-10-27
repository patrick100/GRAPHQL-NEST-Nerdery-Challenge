import { Prisma } from '.prisma/client';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  perPage?: number = 2;

  // @IsOptional()
  // orderBy?: Prisma.CategoryOrderByWithRelationInput;
}
