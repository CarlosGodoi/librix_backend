import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetAllUsersUseCase } from '../users/getAllUsers';

export function makeGetAllUsersUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const getAllUsersUseCase = new GetAllUsersUseCase(usersRepository);

  return getAllUsersUseCase;
}
