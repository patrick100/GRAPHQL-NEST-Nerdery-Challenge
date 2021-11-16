import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { plainToClass } from 'class-transformer';
import { FileImageDto } from './dto/response/file-image.dto';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async generatePresignedUrl(productId: string, userId: string) {
    const s3 = new S3();
    const product = await this.prisma.product.findUnique({
      where: { uuid: productId },
    });
    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userService.findOne(userId);

    const image = await this.prisma.image.create({
      data: {
        key: `${uuid()}.jpeg`,
        productId: product.id,
        userId: user.id,
      },
    });

    const url = await s3.getSignedUrlPromise('putObject', {
      Bucket: process.env.AWS_PRIVATE_BUCKET_NAME,
      Key: image.key,
      ContentType: 'binary/octet-stream',
    });

    return plainToClass(FileImageDto, {
      uuid: image.uuid,
      productId,
      key: image.key,
      url,
    });
  }

  async getImagesbyProductId(productId: string): Promise<FileImageDto[]> {
    const s3 = new S3();
    const product = await this.prisma.product.findUnique({
      where: { uuid: productId },
    });
    if (!product) {
      throw new HttpException('Product Not Found', HttpStatus.NOT_FOUND);
    }

    const images = await this.prisma.image.findMany({
      where: { productId: product.id },
    });

    const fileImages: FileImageDto[] = [];

    for (const image of images) {
      const url = await s3.getSignedUrlPromise('getObject', {
        // Bucket: process.env.AWS_PRIVATE_BUCKET_NAME,
        Bucket: 'nestchallenge',
        Key: image.key,
        ResponseContentType: 'image/jpeg',
      });

      const fileImage = plainToClass(FileImageDto, {
        uuid: image.uuid,
        productId,
        key: image.key,
        url,
      });

      fileImages.push(fileImage);
    }
    return fileImages;
  }
}
