import type { BooksRepository } from '@/repositories/books-repository';
import type { IBooksParamsGetAll } from '@/repositories/prisma/prisma-books-repository';
import type { GetAllParams } from '@/repositories/prisma/types/getAllParams';

export class GetAllBooksUseCase {
  constructor(private booksRepository: BooksRepository) {}

  async execute(pagination: GetAllParams): Promise<IBooksParamsGetAll> {
    const books = await this.booksRepository.getAll(pagination);

    return books;
  }
}
