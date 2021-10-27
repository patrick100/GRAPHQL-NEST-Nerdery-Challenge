import { Role, User } from '.prisma/client';
import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDto } from '../users/dto/response/user.dto';
import { plainToClass } from 'class-transformer';
import { SignInDto } from './dto/request/sign-in.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-up')
  async createUser(@Body() data: CreateUserDto): Promise<UserDto> {
    const user = await this.userService.createUser(data);

    return plainToClass(UserDto, user);
  }

  //@UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Body() data: SignInDto) {
    const authData = await this.authService.signIn(data);
    const user = plainToClass(UserDto, authData.user);

    return { user, token: authData.token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
