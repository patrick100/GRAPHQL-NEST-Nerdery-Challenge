import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    /*  const user = await this.authService.validateUser(new AuthData());
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; */
    return true;
  }
}
