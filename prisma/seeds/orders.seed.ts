import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const orders: Prisma.OrderCreateInput[] = [
  {
    clientId: { connect: { id: 1 } },
    status: 'ONCART',
    totalPrice: 3497,
  },
  {
    clientId: { connect: { id: 2 } },
    status: 'ORDERED',
    totalPrice: 149,
  },
  {
    clientId: { connect: { id: 1 } },
    status: 'ONCART',
    totalPrice: 1999,
  },
];

const orderDetails: Prisma.OrderDetailCreateInput[] = [
  {
    order: { connect: { id: 1 } },
    product: { connect: { id: 1 } },
    unitPrice: 2199,
    quantity: 1,
    subtotal: 2199,
  },
  {
    order: { connect: { id: 1 } },
    product: { connect: { id: 6 } },
    unitPrice: 649,
    quantity: 2,
    subtotal: 1298,
  },
  {
    order: { connect: { id: 2 } },
    product: { connect: { id: 7 } },
    unitPrice: 149,
    quantity: 1,
    subtotal: 149,
  },
  {
    order: { connect: { id: 2 } },
    product: { connect: { id: 4 } },
    unitPrice: 1199,
    quantity: 1,
    subtotal: 1199,
  },
];

const ordersSeed = async () => {
  for (const order of orders) {
    await prisma.order.create({
      data: order,
    });
  }

  for (const orderDetail of orderDetails) {
    await prisma.orderDetail.create({
      data: orderDetail,
    });
  }
};

export default ordersSeed;
