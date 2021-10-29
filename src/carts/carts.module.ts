import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { OrdersService } from 'src/orders/orders.service';
import { UsersService } from 'src/users/users.service';
import { CartsController } from './carts.controller';

@Module({
  controllers: [CartsController],
  providers: [OrdersService, PrismaService, UsersService],
})
export class CartsModule {}
