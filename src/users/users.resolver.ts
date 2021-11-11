import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { ManagerGuard } from 'src/auth/guards/manager.guard';
import TokenPayload from 'src/interfaces/token-payload.interface';
import { GetUserArgs } from './dto/args/get-user.args';
import { UpdateUserInput } from './dto/input/update-user.input';
import { User } from './models/user';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: 'me', nullable: false })
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: TokenPayload): Promise<User> {
    return this.usersService.findOne(user.uuid);
  }

  @Query(() => User, { name: 'user', nullable: false })
  @UseGuards(GqlAuthGuard, ManagerGuard)
  getUser(@Args() getUserArgs: GetUserArgs): Promise<User> {
    return this.usersService.findOne(getUserArgs.uuid);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateMe(
    @CurrentUser() user: TokenPayload,
    @Args('updateUserData') updateUserData: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.modifyUser({ uuid: user.uuid }, updateUserData);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateUser(
    @Args('updateUserData') updateUserData: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.modifyUser(
      { uuid: updateUserData.uuid },
      updateUserData,
    );
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  deleteUser(@CurrentUser() user: TokenPayload): Promise<User> {
    return this.usersService.deleteUser({ uuid: user.uuid });
  }
}
