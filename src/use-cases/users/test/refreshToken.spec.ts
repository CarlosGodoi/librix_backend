import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { RefreshTokenUseCase } from '../refreshToken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '@/utils/errors/appError';
import { TokenService } from '@/services/tokenService';

let usersRepository: InMemoryUsersRepository;
let sut: RefreshTokenUseCase;

describe('Refresh Token Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RefreshTokenUseCase(usersRepository);
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

    vi.spyOn(TokenService, 'verifyRefreshToken').mockReturnValue({
      userId: user.id,
    });

    const { accessToken } = await sut.execute('valid-refresh-token');

    expect(accessToken).toEqual(expect.any(String));
  });

  it('Should not be able to refresh with a non-existent user', async () => {
    vi.spyOn(TokenService, 'verifyRefreshToken').mockReturnValue({
      userId: 'non-existent-id',
    });

    await expect(sut.execute('valid-refresh-token')).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to refresh with an invalid or expired token', async () => {
    vi.spyOn(TokenService, 'verifyRefreshToken').mockImplementation(() => {
      throw new Error('jwt expired');
    });

    await expect(sut.execute('expired-token')).rejects.toThrow('jwt expired');
  });
});
