import { User } from '.prisma/client';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ModifyUserDto } from './dto/request/modify-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // TODO use jwt token
  @Get('me')
  infoMeUser(@Body() userData: { id: number }): Promise<User> {
    return this.userService.user(userData);
  }

  @Get(':userId')
  infoUser(@Param('userId') userId: number): Promise<User> {
    return this.userService.user({ id: +userId });
  }

  // TODO use jwt token
  @Put(':userId')
  modifyMeUser(
    @Param('userId') userId: number,
    @Body()
    userData: ModifyUserDto,
  ): Promise<User> {
    return this.userService.modifyUser({ id: userId }, userData);
  }

  // TODO use jwt token
  @Delete(':userId')
  deleteMeUser(@Param('userId') userId: number): Promise<User> {
    return this.userService.deleteUser({ id: userId });
  }
}
