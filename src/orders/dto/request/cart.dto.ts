// import { Status } from ".prisma/client";

import { IsNumber, IsOptional } from 'class-validator';

export class CartDto {
  @IsNumber()
  readonly clientId: number;

  @IsOptional()
  readonly status: 'ONCART';
}
