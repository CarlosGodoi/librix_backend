import type { BooksRepository } from '@/repositories/books-repository';
import type { IUploadImageBookDTO } from '@/repositories/dto/book-dto';
import { AppError } from '@/utils/errors/appError';
import type { Book } from 'generated/prisma/client';

export class UploadImageBookUseCase {
  constructor(private booksRepository: BooksRepository) {}

  async execute({ id, image }: IUploadImageBookDTO): Promise<Book> {
    const book = await this.booksRepository.findById(id);

    if (!book) {
      throw new AppError('error', 'Book not found.');
    }

    const updatedBook = await this.booksRepository.upload({ id, image });

    if (!updatedBook) {
      throw new AppError('error', 'Unable to upload image.');
    }

    return updatedBook;
  }
}
