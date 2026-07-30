import { Prisma, type Book } from 'generated/prisma/client';
import type { BookCreateInput } from 'generated/prisma/models';
import type { BooksRepository } from '../books-repository';
import type { IUpdateBookDTO, IUploadImageBookDTO } from '../dto/book-dto';
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

    if (skip !== undefined && take !== undefined) {
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

    const [book, total] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy: [{ title: 'asc' }, { author: 'asc' }],
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.book.count({ where }),
    ]);

    const totalPage = take ? Math.ceil(total / take) : 1;

    return {
      books: book,
      total,
      totalPage,
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

  async findManyByIds(ids: string[]): Promise<Book[]> {
    return prisma.book.findMany({
      where: { id: { in: ids } },
    });
  }

  async findManyWithEmbedding(): Promise<Book[]> {
    return prisma.book.findMany({
      where: { embedding: { not: Prisma.DbNull } },
    });
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

  async upload({ id, image }: IUploadImageBookDTO) {
    try {
      const book = await prisma.book.update({
        where: { id },
        data: { coverUrl: image.path },
      });
      return book;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async findManyWithoutEmbedding() {
    return prisma.book.findMany({
      where: {
        embedding: { equals: Prisma.DbNull },
      },
    });
  }

  async updateEmbedding(bookId: string, embedding: number[]) {
    await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        embedding,
        embeddingUpdateAt: new Date(),
      },
    });
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
