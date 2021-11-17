import { Prisma, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AbstractFactory } from './abstract.factory';
import * as faker from 'faker';

type UserInput = Partial<Prisma.UserCreateInput>;
type UserInclude = Prisma.UserInclude;
type UserEntity<T> = Prisma.UserGetPayload<{ include?: T }>;

@Injectable()
export class AuthFactory extends AbstractFactory<User> {
  constructor(protected readonly prismaService: PrismaService) {
    super();
  }

  make<T = UserInclude>(input: UserInput, include?: T): Promise<UserEntity<T>> {
    return this.prismaService.user.create({
      include,
      data: {
        email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: faker.internet.password(),
        emailVerifiedToken: faker.random.alphaNumeric(12),
        passwordVerifiedToken: faker.random.alphaNumeric(12),
        tokens: {
          create: [
            {
              token: faker.random.alphaNumeric(20),
              expiredAt: '1h',
            },
          ],
        },
      },
    });
  }

  async makeMany(factorial: number, input: UserInput = {}): Promise<User[]> {
    return Promise.all([...Array(factorial)].map(() => this.make(input)));
  }
}
