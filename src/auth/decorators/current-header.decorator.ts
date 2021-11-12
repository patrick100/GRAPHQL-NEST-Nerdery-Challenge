import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentHeader = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().headers.authorization;
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.headers.authorization;
  },
);
