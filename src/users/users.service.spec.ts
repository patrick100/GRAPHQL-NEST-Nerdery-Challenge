import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as faker from 'faker';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFactory } from 'src/common/factories/user.factory';
import { User } from '.prisma/client';
import { ModifyUserDto } from './dto/request/modify-user.dto';

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

  afterAll(async () => {
    // await prismaService.clearDatabase();
    await prismaService.$disconnect();
    // await module.close();
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

    it('should retrieve user info', async () => {
      const user = await userService.user({ uuid: userTest.uuid });

      expect(user).toEqual(userTest);
    });
  });

  describe('findOne', () => {
    it('should retrieve user info from uuid', async () => {
      const user = await userService.findOne(userTest.uuid);

      expect(user).toEqual(userTest);
    });
  });

  describe('modifyUser', () => {
    it('should throw an exception if user doesnt exist', async () => {
      const data = {};
      await expect(
        userService.modifyUser({ uuid: faker.datatype.uuid() }, data),
      ).rejects.toThrowError(
        new HttpException('User Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should modify user info', async () => {
      const data = { firstName: 'New test name' };

      await expect(
        userService.modifyUser({ uuid: userTest.uuid }, data),
      ).resolves.toEqual({ ...userTest, ...data, updatedAt: expect.any(Date) });
    });
  });

  describe('deleteUser', () => {
    it('should throw an exception if user doesnt exist', async () => {
      await expect(
        userService.deleteUser({ uuid: faker.datatype.uuid() }),
      ).rejects.toThrowError(
        new HttpException('User Not Found', HttpStatus.NOT_FOUND),
      );
    });

    it('should delete the user', async () => {
      const spy = jest.spyOn(prismaService.user, 'delete');
      const tempUuid = userTest.uuid;

      await userService.deleteUser({ uuid: userTest.uuid });

      expect(spy).toBeCalledWith({
        where: {
          uuid: tempUuid,
        },
      });
    });
  });
});
