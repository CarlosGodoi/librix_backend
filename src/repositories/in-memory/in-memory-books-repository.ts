import type { Book } from 'generated/prisma/client';
import type { BooksRepository } from '../books-repository';
import type { BookCreateInput } from 'generated/prisma/models';
import type { IUpdateBookDTO, IUploadImageBookDTO } from '../dto/book-dto';
import { AppError } from '@/utils/errors/appError';
import type { GetAllParams } from '../prisma/types/getAllParams';

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

  async getAll({ skip = 0, take = 10, search }: GetAllParams) {
    let filteredItems = this.items;

    if (search) {
      filteredItems = this.items.filter(
        (item) =>
          item.title.toLowerCase().startsWith(search.toLowerCase()) ||
          item.author.toLowerCase().startsWith(search.toLowerCase()),
      );
    }
    const startIndex = skip;
    const endIndex = skip + take;

    const total = filteredItems.length;
    const totalPage = Math.ceil(total / take);

    const books = filteredItems.slice(startIndex, endIndex);

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

  async upload(path: IUploadImageBookDTO) {
    const existsIndex = await this.items.findIndex((item) => item.id === path.id);

    if (existsIndex === -1) {
      throw new AppError('error', `Book with ID "${path.id}" not found.`);
    }

    const book = this.items[existsIndex];
    const updatedBook: Book = {
      ...book,
      coverUrl: typeof path.image === 'string' ? path.image : (path.image?.path ?? ''),
    };

    this.items[existsIndex] = updatedBook;

    return updatedBook;
  }

  async delete(id: string) {
    const existingIndex = this.items.findIndex((item) => item.id === id);

    if (existingIndex === -1) {
      throw new AppError('error', 'Book not found.');
    }

    this.items.splice(existingIndex, 1);
  }
}
