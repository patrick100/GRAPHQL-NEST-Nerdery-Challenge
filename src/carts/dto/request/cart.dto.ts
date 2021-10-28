// import { Status } from ".prisma/client";

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CartDto {
  // @ApiProperty({ description: 'uuid of the user' })
  @IsNumber()
  readonly userId: number;
  //readonly status: 'ONCART';
}
