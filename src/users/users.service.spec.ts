import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as faker from 'faker';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { UserFactory } from 'src/common/factories/user.factory';
import { User } from '.prisma/client';

describe('UsersService', () => {
  let userService: UsersService;
  let prismaService: PrismaService;
  let userFactory: UserFactory;
  let userTest: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UsersService, UserFactory],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    userFactory = module.get<UserFactory>(UserFactory);

    userTest = await userFactory.make({});
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('user', () => {
    it('should throw an exception if user doesnt exist', async () => {
      await expect(
        userService.user({ uuid: faker.datatype.uuid() }),
      ).rejects.toThrowError(
        new HttpException('User Not Found', HttpStatus.NOT_FOUND),
      );
    });

    // it('should create a new user', async () => {
    //   await expect(userService.user());
    // });

    it('should retrieve user info', async () => {
      const user = await userService.user({ uuid: userTest.uuid });

      expect(user).toEqual(userTest);
    });
  });
});
