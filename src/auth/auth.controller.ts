import { Role } from '.prisma/client';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  createUser(
    @Body()
    userData: CreateUserDto,
  ) {
    return this.userService.createUser(userData);
  }
}
