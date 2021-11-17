import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { LikesModule } from './likes/likes.module';
import { FilesModule } from './files/files.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { DetailsOrderModule } from './details-order/details-order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: true,
      introspection: true,
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    LikesModule,
    FilesModule,
    OrdersModule,
    PrismaModule,
    DetailsOrderModule,
  ],
})
export class AppModule {}
