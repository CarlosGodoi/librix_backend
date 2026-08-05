import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RefreshTokenUseCase } from '../users/refreshToken';
import { JwtTokenProvider } from '@/services/token/jwt-token-provider';

export function makeRefreshTokenUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const tokenProvider = new JwtTokenProvider();
  const refreshTokenUseCase = new RefreshTokenUseCase(usersRepository, tokenProvider);

  return refreshTokenUseCase;
}
