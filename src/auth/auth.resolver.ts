import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/input/create-user.input';
import { User } from 'src/users/models/user';
import { AuthService } from './auth.service';
import { SignInInput } from './input/sign-in.input';
import { VerifyEmailInput } from './input/verify-email.input';
import { UserToken } from './models/user-token';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  signUp(
    @Args({ name: 'input', type: () => CreateUserInput })
    input: CreateUserInput,
  ): Promise<User> {
    return this.authService.signUp(input);
  }

  @Query(() => UserToken)
  signIn(
    @Args({ name: 'input', type: () => SignInInput }) input: SignInInput,
  ): Promise<UserToken> {
    return this.authService.signIn(input);
  }

  @Mutation(() => Boolean)
  verifyEmail(
    @Args({ name: 'input', type: () => VerifyEmailInput })
    input: VerifyEmailInput,
  ): Promise<void> {
    return this.authService.verifyEmail(input.uuid, input.token);
  }
}
