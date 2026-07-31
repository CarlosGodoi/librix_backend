import { LoanStatus, type Loan } from 'generated/prisma/client';
import type { LoanCreateInput } from 'generated/prisma/models';
import type { IUpdateLoanDTO } from '../dto/loan-dto';
import type { IPagination } from '../interface/pagination';
import type { LoansRepository } from '../loans-repository';
import { AppError } from '@/utils/errors/appError';
import { randomUUID } from 'node:crypto';

function extractUserId(data: LoanCreateInput): string {
  if ('userId' in data && typeof data.userId === 'string') {
    return data.userId;
  }

  if ('user' in data && data.user?.connect?.id) {
    return data.user.connect.id;
  }

  throw new Error('userId is required to create a loan.');
}

function extractBookId(data: LoanCreateInput): string {
  if ('bookId' in data && typeof data.bookId === 'string') {
    return data.bookId;
  }

  if ('book' in data && data.book?.connect?.id) {
    return data.book.connect.id;
  }

  throw new Error('bookId is required to create a loan.');
}

function extractDate(value: string | Date | undefined, fieldName: string): Date {
  if (!value) {
    throw new Error(`${fieldName} is required to create a loan.`);
  }

  return new Date(value);
}

export class InMemoryLoansRepository implements LoansRepository {
  public items: Loan[] = [];

  async create(data: LoanCreateInput) {
    const loan = {
      id: randomUUID(),
      userId: extractUserId(data),
      bookId: extractBookId(data),
      loanDate: extractDate(data.loanDate, 'loanDate'),
      dueDate: extractDate(data.dueDate, 'dueDate'),
      returnDate: data.returnDate ? new Date(data.returnDate) : null,
      status: data.status ?? LoanStatus.INPROGRESS,
    };

    this.items.push(loan);

    return loan;
  }

  async getAll(data: IPagination) {
    const take = data.take || 10;
    const skip = data.skip || 0;

    const startIndex = skip;
    const endIndex = skip + take;

    const total = this.items.length;
    const totalPage = Math.ceil(total / take);

    const loans = this.items.slice(startIndex, endIndex);

    return { total, loans, totalPage };
  }

  async findById(id: string) {
    const loan = this.items.find((item) => item.id === id);

    if (!id) {
      return null;
    }

    return loan || null;
  }

  async findByUserId(userId: string, data: IPagination) {
    const take = data.take || 10;
    const skip = data.skip || 0;

    const userLoans = this.items.filter((item) => item.userId === userId);

    const startIndex = skip;
    const endIndex = skip + take;

    const total = userLoans.length;
    const totalPage = Math.ceil(total / take);

    const loans = userLoans.slice(startIndex, endIndex);

    return { total, loans, totalPage };
  }

  async findActiveByBookId(bookId: string) {
    const result = this.items.filter(
      (item) =>
        (item.bookId === bookId && item.status === LoanStatus.INPROGRESS) ||
        item.status === LoanStatus.DELAYED,
    );

    return result;
  }

  async findActiveByUserAndBook(userId: string, bookId: string) {
    const inProgressBook = this.items.find(
      (item) =>
        item.userId === userId &&
        item.bookId === bookId &&
        (item.status === LoanStatus.INPROGRESS || item.status === LoanStatus.DELAYED),
    );

    return inProgressBook || null;
  }

  async countActiveByUserId(userId: string) {
    const activeLoans = this.items.filter(
      (item) =>
        item.userId === userId &&
        (item.status === LoanStatus.INPROGRESS || item.status === LoanStatus.DELAYED),
    );

    return activeLoans.length;
  }

  async findDelayed() {
    const delayedBook = this.items.filter((item) => item.status === LoanStatus.DELAYED);

    return delayedBook;
  }

  async findDelayedByUserId(userId: string) {
    const delayedLoans = this.items.filter(
      (item) => item.userId === userId && item.status === LoanStatus.DELAYED,
    );

    return delayedLoans;
  }

  async markOverdueAsDelayed() {
    const now = new Date();
    let count = 0;

    this.items.forEach((item) => {
      if (item.status === LoanStatus.INPROGRESS && item.dueDate < now) {
        item.status = LoanStatus.DELAYED;
        count += 1;
      }
    });

    return { count };
  }

  async update(data: IUpdateLoanDTO) {
    const existingIndex = this.items.findIndex((item) => item.id === data.id);

    if (existingIndex === -1) {
      throw new AppError('error', `Loan with "${data.id}" not found.`);
    }

    const existingLoan = this.items[existingIndex];

    const updatedLoan: Loan = {
      ...existingLoan,
      dueDate: data.dueDate ?? existingLoan.dueDate,
    };

    this.items[existingIndex] = updatedLoan;

    return updatedLoan;
  }

  async returnLoan(id: string) {
    const existingIndex = this.items.findIndex((item) => item.id === id);

    if (existingIndex === -1) {
      throw new AppError('error', `Loan with ID '${id}' not found.`);
    }

    const existingLoan = this.items[existingIndex];

    if (existingLoan.status === LoanStatus.RETURNED) {
      throw new AppError('error', `This loan has already been returned.`);
    }

    const returnedLoan: Loan = {
      ...existingLoan,
      status: LoanStatus.RETURNED,
      returnDate: new Date(),
    };

    this.items[existingIndex] = returnedLoan;

    return returnedLoan;
  }

  async delete(id: string) {
    const existingIndex = this.items.findIndex((item) => item.id === id);

    if (existingIndex === -1) {
      throw new AppError('error', 'Loan not found.');
    }

    this.items.splice(existingIndex, 1);
  }
}
