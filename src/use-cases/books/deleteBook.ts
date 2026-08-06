import type { BooksRepository } from '@/repositories/books-repository';
import { AppError } from '@/utils/errors/appError';

export class DeleteBookUseCase {
  constructor(private booksRepository: BooksRepository) {}

  async execute(id: string): Promise<void> {
    const bookExists = await this.booksRepository.findById(id);

    if (!bookExists) {
      throw new AppError('error', 'Book not Found.');
    }

    await this.booksRepository.delete(id);
  }
}
