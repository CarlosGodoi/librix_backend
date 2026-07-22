import { prisma } from '@/lib/prisma';
import type { BooksRepository } from '@/repositories/books-repository';
import { AppError } from '@/utils/errors/appError';
import type { Book } from 'generated/prisma/client';

interface IRegisterBookRequest {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  category: string;
  year: Date;
  copies: number;
  synopsis?: string;
  coverUrl?: string;
}

interface IRegisterBookResponse {
  book: Book;
}

export class RegisterBookUseCase {
  constructor(private booksRepository: BooksRepository) {}

  async execute({
    title,
    author,
    isbn,
    publisher,
    category,
    year,
    copies,
    synopsis,
    coverUrl,
  }: IRegisterBookRequest): Promise<IRegisterBookResponse> {
    const bookExists = await this.booksRepository.findByIsbn(isbn);

    if (bookExists) {
      throw new AppError('error', 'Book already exists.');
    }

    const book = await this.booksRepository.create({
      title,
      author,
      isbn,
      publisher,
      category,
      year,
      copies,
      synopsis,
      coverUrl,
    });

    return { book };
  }
}
