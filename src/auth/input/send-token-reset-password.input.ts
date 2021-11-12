import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class SendTokenResetPasswordInput {
  @Field()
  @IsEmail()
  readonly email: string;
}
