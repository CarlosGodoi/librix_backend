import type { UsersRepository } from '@/repositories/users-repository';
import { AppError } from '@/utils/errors/appError';

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(id: string): Promise<void> {
    const userExists = await this.usersRepository.findById(id);

    if (!userExists) {
      throw new AppError('error', 'User not found.');
    }

    await this.usersRepository.delete(id);
  }
}
