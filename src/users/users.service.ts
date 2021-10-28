import { Prisma, User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/request/create-user.dto';

@Injectable()
export class UsersService {
  private readonly users: User[];
  constructor(private prisma: PrismaService) {}

  async findOne(uuid: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { uuid } });
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
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

    /*
      const emailData: Email = {
      email: user.email,
      subject: 'Confirm Email',
      body: `Send this request via PATCH: ${URL_BASE}/verify-email/${user.uuid}/${tokenVerifyEmail}`,
    };
    sendEmail(emailData);
    */
    return user;
  }

  async modifyUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({
      where: userWhereUniqueInput,
      data: data,
    });
  }

  async deleteUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    return this.prisma.user.delete({ where: userWhereUniqueInput });
  }
}
