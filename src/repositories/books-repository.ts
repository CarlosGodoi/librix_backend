import type { Book, Prisma } from 'generated/prisma/client';
import type { IPagination } from './interface/pagination';
import type { IUpdateBookDTO } from './dto/book-dto';

export interface BooksRepository {
  create(data: Prisma.BookCreateInput): Promise<Book>;
  getAll(pagination: IPagination): Promise<{ total: number; books: Book[]; totalPage?: number }>;
  findById(id: string): Promise<Book | null>;
  update(data: IUpdateBookDTO): Promise<Book>;
  delete(id: string): Promise<void>;
}
