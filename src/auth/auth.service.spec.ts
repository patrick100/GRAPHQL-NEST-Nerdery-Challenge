import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { User } from '@prisma/client';
import * as faker from 'faker';
import { SignInDto } from './dto/request/sign-in.dto';
import { AuthFactory } from 'src/common/factories/auth.factory';

jest.mock('../utils/email', () => ({ sendEmail: () => true }));

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: PrismaService;
  let authFactory: AuthFactory;
  let userTest: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, AuthFactory],
      imports: [
        UsersModule,
        PassportModule,
        ConfigModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    authFactory = module.get<AuthFactory>(AuthFactory);

    userTest = await authFactory.make({});
  });

  afterAll(async () => {
    await prisma.clearDatabase();
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('createToken', () => {
    it('should return a different token if it is called in a second later', async () => {
      const tokenOne = await authService.createToken(userTest.uuid);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const tokenTwo = await authService.createToken(userTest.uuid);

      expect(tokenOne).not.toEqual(tokenTwo);
    });

    it('should throw an error with an invalid usedId', async () => {
      await expect(
        authService.createToken(faker.datatype.uuid()),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('resetPassword', () => {
    it('should throw an error with a wrong uuid', async () => {
      const uuid = faker.datatype.uuid();
      const token = userTest.passwordVerifiedToken;
      const password = faker.internet.password();

      await expect(
        authService.ResetPassword(uuid, token, password),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw an error with a wrong token', async () => {
      const uuid = userTest.uuid;
      const token = faker.random.alphaNumeric(12);
      const password = faker.internet.password();

      await expect(
        authService.ResetPassword(uuid, token, password),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should not throw an error with the correct credentials', async () => {
      const uuid = userTest.uuid;
      const token = userTest.passwordVerifiedToken;
      const password = faker.internet.password();

      await expect(
        authService.ResetPassword(uuid, token, password),
      ).resolves.not.toThrow();
    });
  });

  describe('sendTokenToResetPassword', () => {
    it('should throw an error if the user email does not exist', async () => {
      const email = faker.internet.email();
      await expect(
        authService.sendTokenToResetPassword(email),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should not throw an error if the user email exist', async () => {
      await authService.sendTokenToResetPassword(userTest.email);
      await expect(
        authService.sendTokenToResetPassword(userTest.email),
      ).resolves.not.toThrow();
    });
  });

  describe('verifyEmail', () => {
    it('should throw an error with wrong credentials', async () => {
      const uuid = faker.datatype.uuid();
      const emailVerifiedToken = faker.random.alphaNumeric(12);

      await expect(
        authService.verifyEmail(uuid, emailVerifiedToken),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw an error with a wrong token', async () => {
      const uuid = userTest.uuid;
      const emailVerifiedToken = faker.random.alphaNumeric(12);

      await expect(
        authService.verifyEmail(uuid, emailVerifiedToken),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should not throw an error with the correct credentials', async () => {
      const uuid = userTest.uuid;
      const emailVerifiedToken = userTest.emailVerifiedToken;

      await expect(
        authService.verifyEmail(uuid, emailVerifiedToken),
      ).resolves.not.toThrow();
    });
  });

  describe('signUp', () => {
    it('should not throw an error with the correct credentials', async () => {
      const dto = plainToClass(CreateUserDto, {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      await expect(authService.signUp(dto)).resolves.not.toThrow();
    });

    it('should throw an error if the email is already taken', async () => {
      const dto = plainToClass(CreateUserDto, {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: userTest.email,
        password: faker.internet.password(),
      });

      await expect(
        authService.signUp(dto),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe('signIn', () => {
    it('should throw an error with user email does not exist', async () => {
      const dto = plainToClass(SignInDto, {
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      await expect(
        authService.signIn(dto),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw an error if the user password is wrong', async () => {
      const dto = plainToClass(SignInDto, {
        email: userTest.email,
        password: faker.internet.password(),
      });

      await expect(
        authService.signIn(dto),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should not throw an error with the correct credentials', async () => {
      const dto = plainToClass(CreateUserDto, {
        email: userTest.email,
        password: userTest.password,
      });

      await expect(
        authService.signIn(dto),
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
