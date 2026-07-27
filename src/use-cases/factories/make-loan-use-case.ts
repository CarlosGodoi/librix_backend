import { PrismaBooksRepository } from '@/repositories/prisma/prisma-books-repository';
import { PrismaLoansRepository } from '@/repositories/prisma/prisma-loans-repository';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterLoanUseCase } from '../loans/registerLoan';

export function makeRegisterLoanUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const booksRepository = new PrismaBooksRepository();
  const loansRepository = new PrismaLoansRepository();

  const registerLoanUsecase = new RegisterLoanUseCase(
    loansRepository,
    usersRepository,
    booksRepository,
  );

  return registerLoanUsecase;
}
