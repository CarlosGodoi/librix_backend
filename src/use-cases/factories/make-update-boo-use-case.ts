import { PrismaBooksRepository } from '@/repositories/prisma/prisma-books-repository';
import { UpdateBookUseCase } from '../books/updateBook';

export function makeUpdateBookUseCase() {
  const prismaBooksRepository = new PrismaBooksRepository();
  const updateBookUseCase = new UpdateBookUseCase(prismaBooksRepository);

  return updateBookUseCase;
}
