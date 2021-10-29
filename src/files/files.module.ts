import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FilesService } from './files.service';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [FilesService, PrismaService, UsersService],
  exports: [FilesService],
})
export class FilesModule {}
