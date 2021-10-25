import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { User2Controller } from './user2/user2.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [],
  controllers: [AppController, UsersController, User2Controller],
  providers: [AppService],
})
export class AppModule {}
