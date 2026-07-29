import type { Book, Prisma } from 'generated/prisma/client';
import type { IPagination } from './interface/pagination';
import type { IUpdateBookDTO, IUploadImageBookDTO } from './dto/book-dto';

export interface BooksRepository {
  create(data: Prisma.BookCreateInput): Promise<Book>;
  getAll(data: IPagination): Promise<{ total: number; books: Book[]; totalPage?: number }>;
  findById(id: string): Promise<Book | null>;
  findByIsbn(isbn: string): Promise<Book | null>;
  update(data: IUpdateBookDTO): Promise<Book>;
  upload(path: IUploadImageBookDTO): Promise<Book | null>;
  delete(id: string): Promise<void>;
}
