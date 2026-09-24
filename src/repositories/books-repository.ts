import type { Book, Prisma } from 'generated/prisma/client';
import type { IPagination } from './interface/pagination';
import type { IUpdateBookDTO, IUploadImageBookDTO } from './dto/book-dto';

export type BookWithoutEmbedding = Omit<Book, 'embedding' | 'embeddingUpdateAt'>;
export interface BooksRepository {
  create(data: Prisma.BookCreateInput): Promise<Book>;
  getAll(
    data: IPagination,
  ): Promise<{ total: number; books: BookWithoutEmbedding[]; totalPage?: number }>;
  findById(id: string): Promise<Omit<Book, 'embedding' | 'embeddingUpdateAt'> | null>;
  findManyByIds(ids: string[]): Promise<Book[]>;
  findManyWithEmbedding(): Promise<Book[]>;
  findByIsbn(isbn: string): Promise<Book | null>;
  update(data: IUpdateBookDTO): Promise<Book>;
  upload(path: IUploadImageBookDTO): Promise<Book | null>;
  findManyWithoutEmbedding(): Promise<Book[]>;
  updateEmbedding(bookId: string, embedding: number[]): Promise<void>;
  delete(id: string): Promise<void>;
}
