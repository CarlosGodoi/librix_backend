import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { UpdateUserUserCase } from '../users/updateUser';

export function makeUpdateUserUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const updateUserUseCase = new UpdateUserUserCase(prismaUsersRepository);

  return updateUserUseCase;
}
