import type { BooksRepository } from '@/repositories/books-repository';
import type { LoansRepository } from '@/repositories/loans-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import { AppError } from '@/utils/errors/appError';
import type { Loan } from 'generated/prisma/client';
import { LoanStatus } from 'generated/prisma/enums';

interface IRegisterLoanRequest {
  userId: string;
  bookId: string;
  loanDate: Date;
  dueDate: Date;
}

interface IRegisterLoanResponse {
  loan: Loan;
}

const MAX_ACTIVE_LOANS = 3;

export class RegisterLoanUseCase {
  constructor(
    private loansRepository: LoansRepository,
    private usersRepository: UsersRepository,
    private booksRepository: BooksRepository,
  ) {}

  async execute({
    userId,
    bookId,
    loanDate,
    dueDate,
  }: IRegisterLoanRequest): Promise<IRegisterLoanResponse> {
    const user = await this.usersRepository.findById(userId);
    const book = await this.booksRepository.findById(bookId);

    if (!user) {
      throw new AppError('error', 'User not found.');
    }

    if (!book) {
      throw new AppError('error', 'Book not found.');
    }

    if (dueDate <= loanDate) {
      throw new AppError('error', 'Due date must be after loan date.');
    }

    const availableCopies = book.copies;

    if (availableCopies <= 0) {
      throw new AppError('error', 'No available copies for this book.');
    }

    const activeLoanForBook = await this.loansRepository.findActiveByUserAndBook(userId, bookId);

    if (activeLoanForBook) {
      throw new AppError('error', 'User already has an active loan for this book.');
    }

    const delayedLoans = await this.loansRepository.findDelayedByUserId(userId);

    if (delayedLoans.length > 0) {
      throw new AppError('error', 'User has delayed loans and cannot borrow new books.');
    }

    const activeLoansCount = await this.loansRepository.countActiveByUserId(userId);

    if (activeLoansCount >= MAX_ACTIVE_LOANS) {
      throw new AppError('error', 'User has reached the maximum number of active loans.');
    }

    const loan = await this.loansRepository.create({
      user: { connect: { id: userId } },
      book: { connect: { id: bookId } },
      loanDate,
      dueDate,
      status: LoanStatus.INPROGRESS,
    });

    return { loan };
  }
}
