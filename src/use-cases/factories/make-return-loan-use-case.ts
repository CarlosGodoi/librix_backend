import { PrismaLoansRepository } from '@/repositories/prisma/prisma-loans-repository';
import { ReturnedLoansUseCase } from '../loans/returnedLoan';

export function makeReturnLoanUseCase() {
  const prismaLoansRepository = new PrismaLoansRepository();
  const returnedLoanUseCase = new ReturnedLoansUseCase(prismaLoansRepository);

  return returnedLoanUseCase;
}
