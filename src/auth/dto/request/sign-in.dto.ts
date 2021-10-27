import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

@Exclude()
export class SignInDto {
  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsString()
  @Length(6, 20)
  readonly password: string;
}
