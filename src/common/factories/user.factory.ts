import { Prisma, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';
import * as faker from 'faker';

type UserInput = Partial<Prisma.UserCreateInput>;
type UserInclude = Prisma.UserInclude;
type UserEntity<T> = Prisma.UserGetPayload<{ include?: T }>;

@Injectable()
export class UserFactory extends AbstractFactory<User> {
  constructor(protected readonly prismaService: PrismaService) {
    super();
  }

  make<T = UserInclude>(input: UserInput, include?: T): Promise<UserEntity<T>> {
    return this.prismaService.user.create({
      include,
      data: {
        email: faker.internet.email(),
        firstName: faker.lorem.word(),
        lastName: faker.lorem.word(),
        password: faker.lorem.word(),
      },
    });
  }
}
