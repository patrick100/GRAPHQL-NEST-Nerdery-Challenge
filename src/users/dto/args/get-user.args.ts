import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@ArgsType()
export class GetUserArgs {
  @Field()
  @IsNotEmpty()
  uuid: string;
}
