import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetUserByIdUseCase } from '../users/getUserById';

export function makeGetUserByIdUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(usersRepository);

  return getUserByIdUseCase;
}
