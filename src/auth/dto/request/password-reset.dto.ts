import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PasswordResetDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;
}
