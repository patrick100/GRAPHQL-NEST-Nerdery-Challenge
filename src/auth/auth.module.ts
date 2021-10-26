import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [UsersService, PrismaService],
})
export class AuthModule {}
