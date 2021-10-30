import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendTokenResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;
}
