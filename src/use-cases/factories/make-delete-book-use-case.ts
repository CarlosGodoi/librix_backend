import { PrismaBooksRepository } from '@/repositories/prisma/prisma-books-repository';
import { DeleteBookUseCase } from '../books/deleteBook';

export function makeDeleteBookUseCase() {
  const booksRepository = new PrismaBooksRepository();
  const deleteBookUseCase = new DeleteBookUseCase(booksRepository);

  return deleteBookUseCase;
}
