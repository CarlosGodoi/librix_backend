import type { BooksRepository } from '@/repositories/books-repository';
import type { IUpdateBookDTO } from '@/repositories/dto/book-dto';
import { AppError } from '@/utils/errors/appError';
import type { Book } from 'generated/prisma/client';

export class UpdateBookUseCase {
  constructor(private booksRepository: BooksRepository) {}

  async execute({ id, copies, synopsis }: IUpdateBookDTO): Promise<Book> {
    const book = await this.booksRepository.findById(id);

    if (!book) {
      throw new AppError('error', 'Book not found.');
    }

    const updatedBook = await this.booksRepository.update({
      id,
      copies,
      synopsis,
    });

    return updatedBook;
  }
}
