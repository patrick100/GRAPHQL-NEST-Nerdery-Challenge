// import { Status } from ".prisma/client";

import { IsNumber } from 'class-validator';

export class CartDto {
  @IsNumber()
  readonly userId: number;
  //readonly status: 'ONCART';
}
