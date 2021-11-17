import { User } from '.prisma/client';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      return this.validateUser(request.user.uuid);
    }

    const ctx = GqlExecutionContext.create(context);
    return this.validateUser(ctx.getContext().req.user.uuid);
  }

  async validateUser(uuid: string): Promise<boolean> {
    const user: User = await this.usersService.findOne(uuid);
    return user.role === 'MANAGER';
  }
}
