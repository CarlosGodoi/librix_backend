import type { LoansRepository } from '@/repositories/loans-repository';

export class MarkOverdueLoansUseCase {
  constructor(private loansRepository: LoansRepository) {}

  async execute() {
    const result = await this.loansRepository.markOverdueAsDelayed();
    return result;
  }
}
