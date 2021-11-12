import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import TokenPayload from 'src/interfaces/token-payload.interface';
import { LikesService } from './likes.service';

@Resolver()
export class LikesResolver {
  constructor(private readonly likeService: LikesService) {}

  @Mutation(() => Boolean, { nullable: true })
  @UseGuards(GqlAuthGuard)
  giveLikeProduct(
    @CurrentUser() user: TokenPayload,
    @Args('uuid') uuid: string,
  ): Promise<void> {
    return this.likeService.giveLikeProduct(user.uuid, uuid);
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseGuards(GqlAuthGuard)
  removeLikeProduct(
    @CurrentUser() user: TokenPayload,
    @Args('uuid') uuid: string,
  ): Promise<void> {
    return this.likeService.removeLikeProduct(user.uuid, uuid);
  }
}
