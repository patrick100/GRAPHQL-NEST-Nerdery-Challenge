import { Role, User } from '.prisma/client';
import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDto } from '../users/dto/response/user.dto';
import { plainToClass } from 'class-transformer';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-up')
  async createUser(@Body() userData: CreateUserDto): Promise<UserDto> {
    const user = await this.userService.createUser(userData);
    return plainToClass(UserDto, user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
