import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyPasswordResetDto {
  @ApiProperty()
  @IsString()
  @Length(6, 20)
  readonly password: string;
}
