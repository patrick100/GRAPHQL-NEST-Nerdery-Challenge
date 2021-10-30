import { PrismaService } from 'prisma/prisma.service';

export abstract class AbstractFactory<T> {
  protected abstract readonly prismaService: PrismaService;
  abstract make(input?: unknown, include?: T): Promise<T>;
  abstract makeMany(
    factorial: number,
    input: unknown,
    include?: T,
  ): Promise<T[]>;
}
