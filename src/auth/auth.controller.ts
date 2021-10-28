import {
  Body,
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/request/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDto } from '../users/dto/response/user.dto';
import { plainToClass } from 'class-transformer';
import { SignInDto } from './dto/request/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { PasswordResetDto } from './dto/request/password-reset.dto';
import { VerifyPasswordResetDto } from './dto/request/verify-password-reset.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async createUser(@Body() data: CreateUserDto): Promise<UserDto> {
    const user = await this.authService.signUp(data);

    return plainToClass(UserDto, user);
  }

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() data: SignInDto) {
    const authData = await this.authService.signIn(data);
    const user = plainToClass(UserDto, authData.user);

    return { user, token: authData.token };
  }

  @Patch('verify-email/:uuid/:token')
  @HttpCode(204)
  async verifyEmail(
    @Param('uuid') uuid: string,
    @Param('token') token: string,
  ) {
    return await this.authService.verifyEmail(uuid, token);
  }

  @Patch('password-reset')
  @HttpCode(204)
  async passwordReset(@Body() data: PasswordResetDto) {
    return await this.authService.passwordReset(data.email);
  }

  @Patch('password-reset/:uuid/:token')
  @HttpCode(204)
  async verifyPasswordReset(
    @Param('uuid') uuid: string,
    @Param('token') token: string,
    @Body() data: VerifyPasswordResetDto,
  ) {
    return await this.authService.verifyPasswordReset(
      uuid,
      token,
      data.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sign-out')
  @HttpCode(204)
  async signOut(@Headers() headers) {
    return await this.authService.signOut(headers.authorization);
  }
}
