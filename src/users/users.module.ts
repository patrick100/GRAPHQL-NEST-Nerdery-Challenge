import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
