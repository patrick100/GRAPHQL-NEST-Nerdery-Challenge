import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class VerifyEmailInput {
  @Field()
  @IsUUID()
  uuid: string;

  @Field()
  @IsString()
  token: string;
}
