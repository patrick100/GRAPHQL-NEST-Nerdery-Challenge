import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user';

@ObjectType()
export class UserToken {
  @Field()
  token: string;

  @Field()
  user: User;
}
