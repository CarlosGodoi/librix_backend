import { PrismaBooksRepository } from '@/repositories/prisma/prisma-books-repository';
import { GetAllBooksUseCase } from '../books/getAllBooks';

export function makeGetAllBooksUseCase() {
  const booksRepository = new PrismaBooksRepository();
  const getAllBooksUseCase = new GetAllBooksUseCase(booksRepository);

  return getAllBooksUseCase;
}
