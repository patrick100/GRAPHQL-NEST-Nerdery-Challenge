import { Injectable } from '@nestjs/common';
import { Prisma, User } from '.prisma/client';
import { PrismaService } from 'prisma/prisma.service';

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
