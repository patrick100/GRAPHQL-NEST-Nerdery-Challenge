import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async clearDatabase() {
    await this.likeProduct.deleteMany({});
    await this.image.deleteMany({});
    await this.orderDetail.deleteMany({});
    await this.product.deleteMany({});
    await this.order.deleteMany({});
    await this.category.deleteMany({});
    await this.token.deleteMany({});
    await this.user.deleteMany({});
  }
}
