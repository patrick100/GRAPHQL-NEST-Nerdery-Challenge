import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LikesService } from './likes.service';

@ApiTags('Likes')
@Controller('users/me/products/:productId/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post()
  async givelikeProduct(@Request() req, @Param('productId') productId: string) {
    return await this.likesService.giveLikeProduct(req.user.uuid, productId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete()
  async removeLikeProduct(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    return await this.likesService.removeLikeProduct(req.user.uuid, productId);
  }
}
