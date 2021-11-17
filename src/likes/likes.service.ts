import { LikeProduct, Product, User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LikesService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async verifyLike(user: User, product: Product): Promise<LikeProduct> {
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    }

    const like = await this.prisma.likeProduct.findFirst({
      where: { userId: user.id, productId: product.id },
    });

    return like;
  }

  async giveLikeProduct(userId: string, productId: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { uuid: productId },
    });
    const user = await this.usersService.findOne(userId);
    const like = await this.verifyLike(user, product);

    if (!like) {
      await this.prisma.likeProduct.create({
        data: {
          userId: user.id,
          productId: product.id,
        },
      });

      this.incrementLikeCounter(product.id);
    } else {
      throw new HttpException('Like Already Exist', HttpStatus.CONFLICT);
    }
  }

  async removeLikeProduct(userId: string, productId: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { uuid: productId },
    });
    const user = await this.usersService.findOne(userId);
    const like = await this.verifyLike(user, product);

    if (like) {
      await this.prisma.likeProduct.delete({
        where: { id: like.id },
      });

      this.decrementLikeCounter(product.id);
    } else {
      throw new HttpException('Like Not Found', HttpStatus.NOT_FOUND);
    }
  }

  incrementLikeCounter(productId: number) {
    this.prisma.product.update({
      where: { id: productId },
      data: { likeCounter: { increment: 1 } },
    });
  }

  decrementLikeCounter(productId: number) {
    this.prisma.product.update({
      where: { id: productId },
      data: { likeCounter: { decrement: 1 } },
    });
  }
}
