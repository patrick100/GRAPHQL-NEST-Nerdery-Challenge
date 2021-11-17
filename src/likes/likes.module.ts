import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { LikesResolver } from './likes.resolver';

@Module({
  controllers: [LikesController],
  providers: [LikesService, PrismaService, UsersService, LikesResolver],
  exports: [LikesService],
})
export class LikesModule {}
