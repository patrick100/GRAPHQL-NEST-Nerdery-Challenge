import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { LikesModule } from './likes/likes.module';
import { FilesModule } from './files/files.module';
import { CartsModule } from './orders/carts.module';
import { PrismaModule } from './prisma/prisma.module';
import { DetailsOrderModule } from './details-order/details-order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    LikesModule,
    FilesModule,
    CartsModule,
    PrismaModule,
    DetailsOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
