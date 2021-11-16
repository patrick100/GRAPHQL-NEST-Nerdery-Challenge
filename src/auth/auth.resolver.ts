import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/input/create-user.input';
import { User } from 'src/users/models/user';
import { AuthService } from './auth.service';
import { CurrentHeader } from './decorators/current-header.decorator';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { ResetPasswordInput } from './input/reset-password.input';
import { SendTokenResetPasswordInput } from './input/send-token-reset-password.input';
import { SignInInput } from './input/sign-in.input';
import { VerifyEmailInput } from './input/verify-email.input';
import { ResponseMessage } from '../common/models/response-message';
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

  @Mutation(() => ResponseMessage, { nullable: true })
  async verifyEmail(
    @Args({ name: 'input', type: () => VerifyEmailInput })
    input: VerifyEmailInput,
  ): Promise<ResponseMessage> {
    await this.authService.verifyEmail(input.uuid, input.token);
    const response: ResponseMessage = { message: 'No-Content', code: 204 };

    return response;
  }

  @Mutation(() => ResponseMessage, { nullable: true })
  async sendTokenToResetPassword(
    @Args({ name: 'input', type: () => SendTokenResetPasswordInput })
    input: SendTokenResetPasswordInput,
  ): Promise<ResponseMessage> {
    await this.authService.sendTokenToResetPassword(input.email);
    const response: ResponseMessage = { message: 'No-Content', code: 204 };

    return response;
  }

  @Mutation(() => ResponseMessage, { nullable: true })
  async resetPassword(
    @Args({ name: 'input', type: () => ResetPasswordInput })
    input: ResetPasswordInput,
  ): Promise<ResponseMessage> {
    await this.authService.ResetPassword(
      input.uuid,
      input.token,
      input.password,
    );
    const response: ResponseMessage = { message: 'No-Content', code: 204 };

    return response;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { nullable: true })
  signOut(@CurrentHeader() header: string): Promise<void> {
    return this.authService.signOut(header);
  }
}
