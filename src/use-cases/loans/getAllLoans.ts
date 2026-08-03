import type { LoansRepository } from '@/repositories/loans-repository';
import type {
  GetAllLoansParams,
  ILoansParamsGetAll,
} from '@/repositories/prisma/prisma-loans-repository';

export class GetAllLoansUseCase {
  constructor(private loansRepository: LoansRepository) {}

  async execute(pagination: GetAllLoansParams): Promise<ILoansParamsGetAll> {
    const loans = await this.loansRepository.getAll(pagination);

    return loans;
  }
}
