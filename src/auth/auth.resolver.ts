import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/input/create-user.input';
import { User } from 'src/users/models/user';
import { AuthService } from './auth.service';
import { CurrentHeader } from './decorators/current-header.decorator';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { ResetPasswordInput } from './input/reset-password.input';
import { SendTokenResetPasswordInput } from './input/send-token-reset-password.input';
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

  @Mutation(() => UserToken)
  signIn(
    @Args({ name: 'input', type: () => SignInInput }) input: SignInInput,
  ): Promise<UserToken> {
    return this.authService.signIn(input);
  }

  @Mutation(() => Boolean, { nullable: true })
  verifyEmail(
    @Args({ name: 'input', type: () => VerifyEmailInput })
    input: VerifyEmailInput,
  ): Promise<void> {
    return this.authService.verifyEmail(input.uuid, input.token);
  }

  @Mutation(() => Boolean, { nullable: true })
  sendTokenToResetPassword(
    @Args({ name: 'input', type: () => SendTokenResetPasswordInput })
    input: SendTokenResetPasswordInput,
  ): Promise<void> {
    return this.authService.sendTokenToResetPassword(input.email);
  }

  @Mutation(() => Boolean, { nullable: true })
  resetPassword(
    @Args({ name: 'input', type: () => ResetPasswordInput })
    input: ResetPasswordInput,
  ): Promise<void> {
    return this.authService.ResetPassword(
      input.uuid,
      input.token,
      input.password,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { nullable: true })
  signOut(@CurrentHeader() header: string): Promise<void> {
    console.log(header);
    return this.authService.signOut(header);
  }
}
