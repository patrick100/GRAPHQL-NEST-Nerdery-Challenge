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
import { SendTokenResetPasswordDto } from './dto/request/send-token-reset-password.dto';
import { ResetPasswordDto } from './dto/request/reset-password.dto';

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

  @Patch('reset-password')
  @HttpCode(204)
  async sendTokenToResetPassword(@Body() data: SendTokenResetPasswordDto) {
    return await this.authService.sendTokenToResetPassword(data.email);
  }

  @Patch('reset-password/:uuid/:token')
  @HttpCode(204)
  async resetPassword(
    @Param('uuid') uuid: string,
    @Param('token') token: string,
    @Body() data: ResetPasswordDto,
  ) {
    return await this.authService.ResetPassword(uuid, token, data.password);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sign-out')
  @HttpCode(204)
  async signOut(@Headers() headers) {
    return await this.authService.signOut(headers.authorization);
  }
}
