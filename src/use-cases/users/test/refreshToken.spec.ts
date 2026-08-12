import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { RefreshTokenUseCase } from '../refreshToken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '@/utils/errors/appError';
import type { UsersRepository } from '@/repositories/users-repository';

const tokenProvider = {
  verifyRefreshToken: vi.fn(),
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
};

let usersRepository: UsersRepository;
let sut: RefreshTokenUseCase;

describe('Refresh Token Use Case', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usersRepository = new InMemoryUsersRepository();
    sut = new RefreshTokenUseCase(
      usersRepository,
      tokenProvider as unknown as typeof tokenProvider,
    );
  });

  it('Should be able to refresh the access token', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: 'Visitor@123',
      createdAt: new Date(),
    });

    tokenProvider.verifyRefreshToken.mockReturnValue({
      userId: user.id,
    });

    tokenProvider.generateAccessToken.mockReturnValue('fake-access-token');

    const { accessToken } = await sut.execute('valid-refresh-token');

    expect(accessToken).toBe('fake-access-token');
  });

  it('Should not be able to refresh with a non-existent user', async () => {
    tokenProvider.verifyRefreshToken.mockReturnValue({
      userId: 'non-existent-id',
    });

    await expect(sut.execute('valid-refresh-token')).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to refresh with an invalid or expired token', async () => {
    tokenProvider.verifyRefreshToken.mockImplementation(() => {
      throw new Error('jwt expired');
    });

    await expect(sut.execute('expired-token')).rejects.toBeInstanceOf(AppError);
    await expect(sut.execute('expired-token')).rejects.toThrow('Invalid or expired refresh token.');
  });
});
