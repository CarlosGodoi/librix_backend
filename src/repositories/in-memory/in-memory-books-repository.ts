import type { Book } from 'generated/prisma/client';
import type { BooksRepository } from '../books-repository';
import type { BookCreateInput } from 'generated/prisma/models';
import type { IUpdateBookDTO } from '../dto/book-dto';
import type { IPagination } from '../interface/pagination';
import { AppError } from '@/utils/errors/appError';

export class InMemoryBooksRepository implements BooksRepository {
  public items: Book[] = [];

  async create(data: BookCreateInput) {
    const book = {
      id: data.id || 'book-1',
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      publisher: data.publisher,
      category: data.category,
      year: data.year ? new Date(data.year) : new Date(),
      copies: data.copies,
      synopsis: data.synopsis || '',
      coverUrl: data.coverUrl || '',
    };

    this.items.push(book);

    return book;
  }

  async getAll(data: IPagination) {
    const take = data.take || 10;
    const skip = data.skip || 0;

    const startIndex = skip;
    const endIndex = skip + take;

    const total = this.items.length;
    const totalPage = Math.ceil(total / take);

    const books = this.items.slice(startIndex, endIndex);

    return { total, books, totalPage };
  }

  async findById(id: string) {
    const book = this.items.find((item) => item.id === id);

    if (!id) {
      return null;
    }

    return book || null;
  }

  async findByIsbn(isbn: string) {
    const book = this.items.find((item) => item.isbn === isbn);

    if (!isbn) {
      return null;
    }

    return book || null;
  }

  async update(data: IUpdateBookDTO) {
    const existingIndex = this.items.findIndex((item) => item.id === data.id);

    if (existingIndex === -1) {
      throw new AppError('error', `User with ID ${data.id} not found.`);
    }

    const existingBook = this.items[existingIndex];

    const updatedBook: Book = {
      ...existingBook,
      copies: data.copies,
      synopsis: data.synopsis ?? '',
    };

    this.items[existingIndex] = updatedBook;

    return updatedBook;
  }

  async delete(id: string) {
    this.items.findIndex((item) => item.id === id);
  }
}
