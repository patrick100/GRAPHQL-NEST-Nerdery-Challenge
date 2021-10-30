import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/request/sign-in.dto';
import AuthData from '../interfaces/authData.interface';
import { Token, User } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { sendEmail } from '../utils/email';
import Email from '../interfaces/email.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(data: SignInDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordMatching = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async signUp(data: CreateUserDto): Promise<User> {
    if (await this.prisma.user.count({ where: { email: data.email } })) {
      throw new HttpException(
        'Email already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const emailVerifiedToken = crypto.randomBytes(12).toString('hex');
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        emailVerifiedToken: emailVerifiedToken,
      },
    });

    const emailData: Email = {
      email: user.email,
      subject: 'Confirm Email',
      body: `Send this request via PATCH: URL_BASE/verify-email/${user.uuid}/${emailVerifiedToken}`,
    };

    sendEmail(emailData);

    return user;
  }

  async createToken(uuid: string): Promise<string> {
    const token = this.jwtService.sign({ uuid: uuid });

    await this.prisma.token.create({
      data: {
        token: token,
        userUuid: uuid,
        expiredAt: process.env.JWT_EXPIRES_IN,
      },
    });

    return token;
  }

  async signIn(data: SignInDto): Promise<AuthData> {
    const user = await this.validateUser(data);
    const token = await this.createToken(user.uuid);

    return { user, token };
  }

  async signOut(bearerHeader: string): Promise<void> {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    await this.prisma.token.delete({
      where: {
        token: bearerToken,
      },
    });
  }

  async sendTokenToResetPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new HttpException('Not Found User', HttpStatus.NOT_FOUND);
    }

    const tokenResetPassword = crypto.randomBytes(12).toString('hex');
    const emailData: Email = {
      email: user.email,
      subject: 'Reset Password',
      body: `Send this request via PATCH: URL_BASE/password-reset/${user.uuid}/${tokenResetPassword} 
      with the password in the body example: {password:newpassword}`,
    };

    sendEmail(emailData);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordVerifiedToken: tokenResetPassword },
    });
  }

  async ResetPassword(
    uuid: string,
    token: string,
    password: string,
  ): Promise<void> {
    const user = await this.usersService.findOne(uuid);

    if (!user) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.passwordVerifiedToken === token) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.update({
        where: { uuid: uuid },
        data: { password: hashedPassword, passwordVerifiedToken: null },
      });
    } else {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async verifyEmail(uuid: string, token: string): Promise<void> {
    const user = await this.usersService.findOne(uuid);

    if (!user) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.emailVerifiedToken === token) {
      await this.prisma.user.update({
        where: { uuid: uuid },
        data: { emailVerifiedAt: new Date(), emailVerifiedToken: null },
      });
    } else {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async findTokenbyUuid(uuid: string): Promise<Token> {
    return await this.prisma.token.findFirst({ where: { userUuid: uuid } });
  }
}
