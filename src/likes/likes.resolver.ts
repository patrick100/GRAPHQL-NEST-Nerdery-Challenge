import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { ResponseMessage } from 'src/common/models/response-message';
import TokenPayload from 'src/common/interfaces/token-payload.interface';
import { LikesService } from './likes.service';

@Resolver()
export class LikesResolver {
  constructor(private readonly likeService: LikesService) {}

  @Mutation(() => ResponseMessage, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async giveLikeProduct(
    @CurrentUser() user: TokenPayload,
    @Args('uuid') uuid: string,
  ): Promise<ResponseMessage> {
    await this.likeService.giveLikeProduct(user.uuid, uuid);
    const response: ResponseMessage = { message: 'No-Content', code: 204 };

    return response;
  }

  @Mutation(() => ResponseMessage, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async removeLikeProduct(
    @CurrentUser() user: TokenPayload,
    @Args('uuid') uuid: string,
  ): Promise<ResponseMessage> {
    await this.likeService.removeLikeProduct(user.uuid, uuid);
    const response: ResponseMessage = { message: 'No-Content', code: 204 };

    return response;
  }
}
