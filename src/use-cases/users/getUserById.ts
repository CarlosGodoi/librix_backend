import type { UsersRepository } from '@/repositories/users-repository';
import { AppError } from '@/utils/errors/appError';
import type { User } from 'generated/prisma/client';

export class GetUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(id: string): Promise<User | null> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('error', 'User not found.');
    }

    return user;
  }
}
