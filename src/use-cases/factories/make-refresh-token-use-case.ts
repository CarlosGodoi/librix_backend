import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RefreshTokenUseCase } from '../users/refreshToken';

export function makeRefreshTokenUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const refreshTokenUseCase = new RefreshTokenUseCase(usersRepository);

  return refreshTokenUseCase;
}
