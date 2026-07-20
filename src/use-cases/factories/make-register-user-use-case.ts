import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository';
import { RegisterUserUserCase } from '../users/register';

export function makeRegisterUserUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const registerUserUseCase = new RegisterUserUserCase(prismaUsersRepository);

  return registerUserUseCase;
}
