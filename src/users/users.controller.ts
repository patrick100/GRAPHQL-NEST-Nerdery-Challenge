import { User } from '.prisma/client';
import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':userId')
  infoUser(@Param('userId') userId: string): Promise<User> {
    return this.userService.user({ id: +userId });
  }

  @Get('me')
  // TODO use jwt token
  infoMeUser() {
    return 'me action';
  }

  @Put('me')
  modifyMeUser() {
    return 'me action';
  }

  @Delete('me')
  deleteMeUser() {
    return 'delete me action';
  }
}
