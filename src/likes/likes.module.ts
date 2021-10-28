import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [LikesController],
  providers: [LikesService, PrismaService, UsersService],
  exports: [LikesService],
})
export class LikesModule {}
