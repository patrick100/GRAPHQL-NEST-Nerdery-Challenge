import { Prisma } from '@prisma/client';
import { prisma } from '../seed';
import * as bcrypt from 'bcrypt';

const users: Prisma.UserCreateInput[] = [
  {
    email: 'patricklazo@ravn.co',
    firstName: 'Patrick',
    lastName: 'Lazo',
    password: '123456',
    role: 'MANAGER',
  },
  {
    email: 'alexander@ravn.co',
    firstName: 'Alexander',
    lastName: 'Pinto',
    password: '123456',
  },
];

const usersSeed = async () => {
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: user,
    });
  }
};

export default usersSeed;
