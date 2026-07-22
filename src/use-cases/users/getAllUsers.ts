import type { IUsersParamsGetAll } from '@/repositories/prisma/prisma-users-repository';
import type { GetAllParams } from '@/repositories/prisma/types/getAllParams';
import type { UsersRepository } from '@/repositories/users-repository';

export class GetAllUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(pagination: GetAllParams): Promise<IUsersParamsGetAll> {
    const users = await this.usersRepository.getAll(pagination);

    return users;
  }
}
