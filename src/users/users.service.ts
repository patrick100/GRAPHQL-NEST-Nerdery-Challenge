import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '.prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { UserDto } from './dto/response/user.dto';
import { ModifyUserDto } from './dto/request/modify-user.dto';

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
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async modifyUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    data: ModifyUserDto,
  ): Promise<User> {
    // user exists?
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.user.update({
      where: userWhereUniqueInput,
      data: data,
    });
  }

  async deleteUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    // user exists?
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    console.log(user);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.user.delete({ where: userWhereUniqueInput });
  }
}
