import type { UsersRepository } from '@/repositories/users-repository';
import type { TokenProvider } from '@/services/token/token-provider';
import { AppError } from '@/utils/errors/appError';

export class RefreshTokenUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private tokenProvider: TokenProvider,
  ) {}

  async execute(refreshToken: string) {
    let decoded;
    try {
      decoded = this.tokenProvider.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('error', 'Invalid or expired refresh token.');
    }

    const user = await this.usersRepository.findById(decoded.userId);
    if (!user) {
      throw new AppError('error', 'User not found.');
    }

    const accessToken = this.tokenProvider.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.profile,
    });

    return { accessToken };
  }
}
