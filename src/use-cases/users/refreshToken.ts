import type { UsersRepository } from '@/repositories/users-repository';
import { TokenService } from '@/services/tokenService';
import { AppError } from '@/utils/errors/appError';

export class RefreshTokenUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(refreshToken: string) {
    const decoded = TokenService.verifyRefreshToken(refreshToken);

    const user = await this.usersRepository.findById(decoded.userId);

    if (!user) {
      throw new AppError('error', 'User not found.');
    }

    const accessToken = TokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.profile,
    });

    return { accessToken };
  }
}
