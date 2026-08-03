import type { LoansRepository } from '@/repositories/loans-repository';
import { LoanStatus } from 'generated/prisma/enums';

interface IReturnedLoansRequest {
  id: string;
}

interface IReturnedLoansResponse {
  status: LoanStatus;
  returnDate: Date;
}

export class ReturnedLoansUseCase {
  constructor(private loansRepository: LoansRepository) {}

  async execute({ id }: IReturnedLoansRequest): Promise<IReturnedLoansResponse> {
    const returnedLoan = await this.loansRepository.returnLoan(id);

    return {
      status: returnedLoan.status,
      returnDate: returnedLoan.returnDate as Date,
    };
  }
}
