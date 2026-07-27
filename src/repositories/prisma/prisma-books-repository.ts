import type { Book, Prisma } from 'generated/prisma/client';
import type { BookCreateInput } from 'generated/prisma/models';
import type { BooksRepository } from '../books-repository';
import type { IUpdateBookDTO } from '../dto/book-dto';
import type { IPagination } from '../interface/pagination';
import { prisma } from '@/lib/prisma';
import type { GetAllParams } from './types/getAllParams';
import { Pagination } from '@/utils/paginationCalc';
import { AppError } from '@/utils/errors/appError';

export interface IBooksParamsGetAll extends IPagination {
  books: Book[];
  total: number;
  totalPage?: number;
}

export class PrismaBooksRepository implements BooksRepository {
  async create(data: BookCreateInput) {
    const book = await prisma.book.create({
      data,
    });

    return book;
  }

  async getAll({ skip, take, search }: GetAllParams): Promise<IBooksParamsGetAll> {
    let pagination: IPagination = {};

    if (skip && take) {
      pagination = Pagination(skip, take);
    }

    const where: Prisma.BookWhereInput = {
      ...(search && {
        OR: [
          {
            title: {
              startsWith: search,
            },
            author: {
              startsWith: search,
            },
          },
        ],
      }),
    };

    const book = await prisma.book.findMany({
      where,
      orderBy: [{ title: 'asc' }, { author: 'asc' }],
      skip: pagination.skip,
      take: pagination.take,
    });

    const total = await prisma.book.count({ where });
    const totalPage = take ? Math.ceil(total / take) : total;

    return {
      books: book,
      total,
      ...(pagination.take && { totalPage }),
    };
  }

  async findById(id: string) {
    const book = await prisma.book.findFirst({
      where: {
        id,
      },
    });

    return book;
  }

  async findByIsbn(isbn: string) {
    const book = await prisma.book.findUnique({
      where: {
        isbn,
      },
    });

    return book;
  }

  async update(data: IUpdateBookDTO) {
    const book = await prisma.book.update({
      where: {
        id: data.id ? data.id : '',
      },
      data: {
        copies: data.copies,
        synopsis: data.synopsis,
      },
    });

    return book;
  }

  async delete(id: string) {
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!book) {
      throw new AppError('error', 'Book not found.');
    }

    await prisma.book.delete({
      where: {
        id,
      },
    });
  }
}
