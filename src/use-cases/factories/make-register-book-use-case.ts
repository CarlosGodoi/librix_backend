import { PrismaBooksRepository } from '@/repositories/prisma/prisma-books-repository';
import { RegisterBookUseCase } from '../books/registerBook';

export function makeRegisterBookUseCase() {
  const prismabooksRepository = new PrismaBooksRepository();
  const registerBookUseCase = new RegisterBookUseCase(prismabooksRepository);

  return registerBookUseCase;
}
