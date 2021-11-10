import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';
import TokenPayload from 'src/interfaces/token-payload.interface';
import { GetUserArgs } from './dto/args/get-user.args';
import { GetUsersArgs } from './dto/args/get-users.args';
import { CreateUserInput } from './dto/input/create-user.input';
import { DeleteUserInput } from './dto/input/delete-user.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { User } from './models/user';
import { UsersService } from './users.service';
import { UsersService2 } from './users2.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    //private readonly usersService2: UsersService2,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => User, { name: 'user', nullable: false })
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: TokenPayload): Promise<User> {
    return this.usersService.findOne(user.uuid);
  }

  /*   @Mutation(() => User)
  createUser(@Args('createUserData') createUserData: CreateUserInput): User {
    const user = this.usersService2.createUser(createUserData);
    console.log(user);
    return plainToClass(User, user);
  } */

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateUser(
    @CurrentUser() user: TokenPayload,
    @Args('updateUserData') updateUserData: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.modifyUser({ uuid: user.uuid }, updateUserData);
  }

  /*   @Mutation(() => User)
  deleteUser(@Args('deleteUserData') deleteUserData: DeleteUserInput): User {
    return this.usersService2.deleteUser(deleteUserData);
  }  */
}
