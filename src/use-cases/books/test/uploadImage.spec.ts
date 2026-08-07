import { InMemoryBooksRepository } from '@/repositories/in-memory/in-memory-books-repository';
import { describe, it, beforeEach, expect } from 'vitest';
import type { BooksRepository } from '@/repositories/books-repository';
import { UploadImageBookUseCase } from '../upload-image';
import { AppError } from '@/utils/errors/appError';

let booksRepository: BooksRepository;
let sut: UploadImageBookUseCase;

describe('Upload Book Use Case', () => {
  beforeEach(() => {
    booksRepository = new InMemoryBooksRepository();
    sut = new UploadImageBookUseCase(booksRepository);
  });

  it('Should be able possible to upload image for book.', async () => {
    const book = await booksRepository.create({
      title: 'Book 1',
      author: 'Author 1',
      isbn: 'ISBN 999-999-99-00-5',
      publisher: 'Editora 1',
      category: 'Ficção',
      year: new Date(),
      copies: 2,
      synopsis: 'Um livro de ficção',
      coverUrl: '',
    });

    const bookId = book.id;

    const uploadImage = await sut.execute({
      id: bookId,
      image: { path: 'imagem do livro' },
    });

    expect(uploadImage).toEqual(
      expect.objectContaining({
        coverUrl: 'imagem do livro',
      }),
    );
  });

  it('it should not be possible to upload image for book with wrong ID', async () => {
    try {
      await sut.execute({
        id: 'id-non-exists',
        image: { path: 'imagem do livro' },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    }
  });
});
