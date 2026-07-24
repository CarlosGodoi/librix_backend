import { LoanStatus, type Loan, type Prisma } from 'generated/prisma/client';
import type { LoanCreateInput } from 'generated/prisma/models';
import type { IUpdateLoanDTO } from '../dto/loan-dto';
import type { IPagination } from '../interface/pagination';
import type { LoansRepository } from '../loans-repository';
import { prisma } from '@/lib/prisma';
import type { GetAllParams } from './types/getAllParams';
import { Pagination } from '@/utils/paginationCalc';
import { AppError } from '@/utils/errors/appError';

export interface ILoansParamsGetAll extends IPagination {
  loans: Loan[];
  total: number;
  totalPage?: number;
}

export interface GetAllLoansParams extends GetAllParams {
  status?: LoanStatus;
}

export class PrismaLoansRepository implements LoansRepository {
  async create(data: LoanCreateInput) {
    const loan = await prisma.loan.create({
      data,
    });

    return loan;
  }

  async getAll({ skip, take, search, status }: GetAllLoansParams): Promise<ILoansParamsGetAll> {
    let pagination: IPagination = {};

    if (skip && take) {
      pagination = Pagination(skip, take);
    }

    const where: Prisma.LoanWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { book: { title: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [loans, total] = await prisma.$transaction([
      prisma.loan.findMany({
        where,
        orderBy: { loanDate: 'desc' },
        skip: pagination.skip,
        take: pagination.take,
        include: { book: true, user: true },
      }),
      prisma.loan.count({ where }),
    ]);

    const totalPage = take ? Math.ceil(total / take) : total;

    return {
      loans,
      total,
      ...(pagination.take && { totalPage }),
    };
  }

  async findById(id: string) {
    const loan = await prisma.loan.findFirst({
      where: {
        id,
      },
    });

    return loan;
  }

  async findByUserId(userId: string, { skip, take }: IPagination): Promise<ILoansParamsGetAll> {
    let pagination: IPagination = {};

    if (skip && take) {
      pagination = Pagination(skip, take);
    }

    const where: Prisma.LoanWhereInput = { userId };

    const [loans, total] = await prisma.$transaction([
      prisma.loan.findMany({
        where,
        orderBy: { loanDate: 'desc' },
        skip: pagination.skip,
        take: pagination.take,
        include: { book: true },
      }),
      prisma.loan.count({ where }),
    ]);

    const totalPage = take ? Math.ceil(total / take) : total;

    return {
      loans,
      total,
      ...(pagination.take && { totalPage }),
    };
  }

  async findActiveByBookId(bookId: string) {
    const inProgressBook = await prisma.loan.findMany({
      where: {
        bookId,
        status: { in: ['INPROGRESS', 'DELAYED'] },
      },
    });

    return inProgressBook;
  }

  async findActiveByUserAndBook(userId: string, bookId: string) {
    const inProgressBook = await prisma.loan.findFirst({
      where: {
        userId,
        bookId,
        status: { in: ['INPROGRESS', 'DELAYED'] },
      },
    });

    return inProgressBook;
  }

  async countActiveByUserId(userId: string) {
    const countInProgressBook = await prisma.loan.count({
      where: {
        userId,
        status: { in: ['INPROGRESS', 'DELAYED'] },
      },
    });

    return countInProgressBook;
  }

  async findDelayed() {
    const delayedBook = await prisma.loan.findMany({
      where: { status: 'DELAYED' },
      include: { user: true, book: true },
    });

    return delayedBook;
  }

  async markOverdueAsDelayed() {
    const result = await prisma.loan.updateMany({
      where: {
        status: 'INPROGRESS',
        dueDate: { lt: new Date() },
      },
      data: { status: 'DELAYED' },
    });

    return result;
  }

  async update(data: IUpdateLoanDTO) {
    const loan = await prisma.loan.update({
      where: {
        id: data.id,
      },
      data: {
        dueDate: data.dueDate,
      },
    });

    return loan;
  }

  async returnLoan(id: string) {
    const loan = await prisma.loan.findUnique({
      where: {
        id,
      },
    });

    if (!loan) {
      throw new AppError('error', 'Loan not found.');
    }

    if (loan.status === 'RETURNED') {
      throw new AppError('error', 'This loan has already been returned.');
    }

    const returnedLoan = await prisma.loan.update({
      where: { id },
      data: {
        status: 'RETURNED',
        returnDate: new Date(),
      },
    });

    return returnedLoan;
  }

  async delete(id: string) {
    const loan = await prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      throw new AppError('error', 'Loan not found.');
    }

    await prisma.loan.delete({
      where: { id },
    });
  }
}
