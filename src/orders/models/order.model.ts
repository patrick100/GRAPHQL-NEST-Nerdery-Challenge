import { Status } from '.prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { Detail } from 'src/details-order/models/detail.model';
import { User } from 'src/users/models/user';

@ObjectType()
export class Order {
  @Field()
  readonly uuid: string;

  @Field({ nullable: true })
  readonly userId: number;

  @Field((type) => User)
  user: User;

  @Field({ nullable: true })
  readonly status: Status;

  @Field({ nullable: true })
  readonly totalPrice: number;

  @Field({ nullable: true })
  readonly createdAt: Date;

  @Field({ nullable: true })
  readonly updatedAt: Date;

  @Field((type) => [Detail], { nullable: 'items' })
  details: Detail[];
}
