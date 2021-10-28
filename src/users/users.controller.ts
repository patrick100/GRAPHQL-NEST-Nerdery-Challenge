import { User } from '.prisma/client';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ModifyUserDto } from './dto/request/modify-user.dto';
import { UsersService } from './users.service';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/response/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // TODO use jwt token
  @Get('me')
  async infoMeUser(@Body() userData: { id: number }): Promise<UserDto> {
    const user = await this.userService.user(userData);

    return plainToClass(UserDto, user);
  }

  @Get(':userId')
  async infoUser(@Param('userId') userId: number): Promise<UserDto> {
    const user = await this.userService.user({ id: +userId });

    return plainToClass(UserDto, user);
  }

  // TODO use jwt token
  @Put(':userId')
  async modifyMeUser(
    @Param('userId') userId: number,
    @Body()
    userData: ModifyUserDto,
  ): Promise<UserDto> {
    const user = this.userService.modifyUser({ id: userId }, userData);

    return plainToClass(UserDto, user);
  }

  // TODO use jwt token
  @Delete(':userId')
  async deleteMeUser(@Param('userId') userId: number): Promise<UserDto> {
    const user = this.userService.deleteUser({ id: userId });

    return plainToClass(UserDto, user);
  }
}
