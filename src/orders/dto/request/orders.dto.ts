import { IsNumber } from 'class-validator';

export class OrdersDto {
  @IsNumber()
  readonly orderId: number;
}
