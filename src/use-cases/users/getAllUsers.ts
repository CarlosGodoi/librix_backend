import type {
  GetAllParams,
  IUsersParamsGetAll,
} from '@/repositories/prisma/prisma-users-repository';
import type { UsersRepository } from '@/repositories/users-repository';

export class GetAllUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(pagination: GetAllParams): Promise<IUsersParamsGetAll> {
    const users = await this.usersRepository.getAll(pagination);

    return users;
  }
}
