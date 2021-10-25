import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const likes: Prisma.LikeProductCreateInput[] = [
  {
    user: { connect: { id: 1 } },
    product: { connect: { id: 1 } },
  },
  {
    user: { connect: { id: 1 } },
    product: { connect: { id: 2 } },
  },
  {
    user: { connect: { id: 1 } },
    product: { connect: { id: 3 } },
  },
  {
    user: { connect: { id: 2 } },
    product: { connect: { id: 1 } },
  },
  {
    user: { connect: { id: 2 } },
    product: { connect: { id: 4 } },
  },
  {
    user: { connect: { id: 2 } },
    product: { connect: { id: 5 } },
  },
];

const likeProductsSeed = async () => {
  for (const like of likes) {
    await prisma.likeProduct.create({
      data: like,
    });
    //update field like_counter in product
    await prisma.product.update({
      where: { id: like.product.connect.id },
      data: { likeCounter: { increment: 1 } },
    });
  }
};

export default likeProductsSeed;
