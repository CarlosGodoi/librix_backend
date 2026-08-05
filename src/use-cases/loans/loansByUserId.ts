import type { IPagination } from '@/repositories/interface/pagination';
import type { LoansRepository } from '@/repositories/loans-repository';
import type { ILoansParamsGetAll } from '@/repositories/prisma/prisma-loans-repository';

export class GetLoansByUserIdUseCase {
  constructor(private loansRepository: LoansRepository) {}

  async execute(userId: string, data: IPagination): Promise<ILoansParamsGetAll> {
    return this.loansRepository.findByUserId(userId, {
      skip: data.skip,
      take: data.take,
    });
  }
}
