import { PrismaBooksRepository } from '@/repositories/prisma/prisma-books-repository';
import { UploadImageBookUseCase } from '../books/upload-image';

export function makeUploadImageBookUseCase() {
  const booksRepository = new PrismaBooksRepository();
  const uploadImageBookUseCase = new UploadImageBookUseCase(booksRepository);

  return uploadImageBookUseCase;
}
