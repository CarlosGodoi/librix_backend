import type { Loan, Prisma } from 'generated/prisma/client';
import type { IPagination } from './interface/pagination';
import type { IUpdateLoanDTO } from './dto/loan-dto';

export interface LoansRepository {
  create(data: Prisma.LoanCreateInput): Promise<Loan>;

  getAll(data: IPagination): Promise<{ total: number; loans: Loan[]; totalPage?: number }>;

  findById(id: string): Promise<Loan | null>;

  findByUserId(
    userId: string,
    data: IPagination,
  ): Promise<{ total: number; loans: Loan[]; totalPage?: number }>;

  findActiveByBookId(bookId: string): Promise<Loan[]>;

  findActiveByUserAndBook(userId: string, bookId: string): Promise<Loan | null>;

  countActiveByUserId(userId: string): Promise<number>;

  findDelayed(): Promise<Loan[]>;

  findDelayedByUserId(userId: string): Promise<Loan[]>;

  markOverdueAsDelayed(): Promise<{ count: number }>;

  update(data: IUpdateLoanDTO): Promise<Loan>;

  returnLoan(id: string): Promise<Loan>;

  delete(id: string): Promise<void>;
}
