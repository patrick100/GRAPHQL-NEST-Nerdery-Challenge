import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, Length } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsUUID()
  uuid: string;

  @Field()
  @IsString()
  token: string;

  @Field()
  @IsString()
  @Length(6, 20)
  password: string;
}
