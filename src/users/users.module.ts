import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersService2 } from './users2.service';
import { UsersResolver } from './users.resolver';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersService2, PrismaService, UsersResolver],
  exports: [UsersService, UsersService2],
})
export class UsersModule {}
