import { User } from '@prisma/client';

interface AuthData {
  token: string;
  user: User;
}

export default AuthData;
