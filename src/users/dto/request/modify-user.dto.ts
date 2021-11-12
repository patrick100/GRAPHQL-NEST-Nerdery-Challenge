import { IsOptional, IsString } from 'class-validator';

export class ModifyUserDto {
  @IsString()
  readonly uuid: string;

  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;
}
