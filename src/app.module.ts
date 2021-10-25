import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthController } from './auth/auth.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [],
  controllers: [AppController, UsersController, AuthController],
  providers: [AppService, UsersService, PrismaService],
})
export class AppModule {}
