import type { BooksRepository } from '@/repositories/books-repository';
import { AppError } from '@/utils/errors/appError';
import type { Book } from 'generated/prisma/client';

export class GetBookByIdUseCase {
  constructor(private booksRepository: BooksRepository) {}

  async execute(id: string): Promise<Book | null> {
    const book = await this.booksRepository.findById(id);

    if (!book) {
      throw new AppError('error', 'Book not found.');
    }

    return book;
  }
}
