import { User } from '.prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ModifyUserDto } from './dto/request/modify-user.dto';
import { UsersService } from './users.service';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/response/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async infoMeUser(@Request() req): Promise<UserDto> {
    const user = await this.userService.user(req.user.uuid);

    return plainToClass(UserDto, user);
  }

  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Get(':userId')
  async infoUser(@Param('userId') userId: string): Promise<UserDto> {
    const user = await this.userService.user({ uuid: userId });

    return plainToClass(UserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async modifyMeUser(
    @Request() req,
    @Body()
    userData: ModifyUserDto,
  ): Promise<UserDto> {
    const user = this.userService.modifyUser({ id: req.user.uuid }, userData);

    return plainToClass(UserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMeUser(@Request() req): Promise<UserDto> {
    const user = this.userService.deleteUser({ id: req.user.uuid });

    return plainToClass(UserDto, user);
  }
}
