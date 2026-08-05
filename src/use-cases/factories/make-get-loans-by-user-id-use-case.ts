import { PrismaLoansRepository } from '@/repositories/prisma/prisma-loans-repository';
import { GetLoansByUserIdUseCase } from '../loans/loansByUserId';

export function makeGetLoansByUserIdUseCase() {
  const loansRepository = new PrismaLoansRepository();
  const getLoansByUserIdUseCase = new GetLoansByUserIdUseCase(loansRepository);

  return getLoansByUserIdUseCase;
}
