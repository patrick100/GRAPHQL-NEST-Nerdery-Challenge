import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map((data) => {
          if (
            data !== undefined &&
            data.constructor.name === 'QueueCollectionDto'
          ) {
            return data;
          } else {
            return { data };
          }
        }),
      );
    }

    return next.handle();
  }
}