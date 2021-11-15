import { IsOptional, IsString } from 'class-validator';

export class ModifyUserDto {
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;
}
