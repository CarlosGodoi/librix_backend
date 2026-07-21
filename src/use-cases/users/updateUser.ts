import type { UsersRepository } from '../../repositories/users-repository';
import { AppError } from '../../utils/errors/appError';
import type { IUpdatedUserDTO } from '@/repositories/dto/user-dto';
import type { User } from 'generated/prisma/browser';

export class UpdateUserUserCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    name,
    email,
    phone,
    profile,
    situation,
    updatedAt,
  }: IUpdatedUserDTO): Promise<User> {
    const userExists = await this.usersRepository.findById(id || '');

    if (!userExists) {
      throw new AppError('error', `User not found.`);
    }

    const updatedUser = await this.usersRepository.update({
      id,
      name,
      email,
      phone,
      profile,
      situation,
      updatedAt: updatedAt ?? new Date(),
    });

    return updatedUser;
  }
}
