import { PrismaLoansRepository } from '@/repositories/prisma/prisma-loans-repository';
import { GetAllLoansUseCase } from '../loans/getAllLoans';

export function makeGetAllLoansUseCase() {
  const loansRepository = new PrismaLoansRepository();
  const getAllLoansUseCase = new GetAllLoansUseCase(loansRepository);

  return getAllLoansUseCase;
}
