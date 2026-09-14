import { PrismaLoansRepository } from '@/repositories/prisma/prisma-loans-repository';
import { MarkOverdueLoansUseCase } from '../loans/markOverdueLoans';

export function makeMarkOverdueLoansUseCase() {
  const loansRepository = new PrismaLoansRepository();
  const markOverdueLoansUseCase = new MarkOverdueLoansUseCase(loansRepository);

  return markOverdueLoansUseCase;
}
