import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/input/create-user.input';
import { User } from 'src/users/models/user';
import { AuthService } from './auth.service';
import { SignInInput } from './input/sign-in.input';
import { UserToken } from './models/user-token';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  signUp(
    @Args({ name: 'input', type: () => CreateUserInput })
    input: CreateUserInput,
  ) {
    return this.authService.signUp(input);
  }

  @Mutation(() => UserToken)
  signIn(@Args({ name: 'input', type: () => SignInInput }) input: SignInInput) {
    return this.authService.signIn(input);
  }
}
