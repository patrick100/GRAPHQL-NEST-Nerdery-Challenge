import { Prisma, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
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
    return await this.prisma.user.create({
      data,
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
