import { Role } from '.prisma/client';
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('signup')
  createUser(
    @Body()
    userData: {
      firstName: string;
      lastName: string;
      password: string;
      email: string;
      role: Role;
    },
  ) {
    return this.userService.createUser(userData);
  }
}
