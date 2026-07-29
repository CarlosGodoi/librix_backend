import { PrismaBooksRepository } from '@/repositories/prisma/prisma-books-repository';
import { GetBookByIdUseCase } from '../books/getBookById';

export function makeGetBookByIdUseCase() {
  const booksRepository = new PrismaBooksRepository();
  const getBookByIdUseCase = new GetBookByIdUseCase(booksRepository);

  return getBookByIdUseCase;
}
