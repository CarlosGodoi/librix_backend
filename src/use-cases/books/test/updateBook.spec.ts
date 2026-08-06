import { InMemoryBooksRepository } from '@/repositories/in-memory/in-memory-books-repository';
import { describe, it, beforeEach, expect } from 'vitest';
import { UpdateBookUseCase } from '../updateBook';
import { AppError } from '@/utils/errors/appError';

let booksRepository: InMemoryBooksRepository;
let sut: UpdateBookUseCase;

describe('Update User Use Case', () => {
  beforeEach(() => {
    booksRepository = new InMemoryBooksRepository();
    sut = new UpdateBookUseCase(booksRepository);
  });

  it('Should be able to update datas at book.', async () => {
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

    const updateBook = await sut.execute({
      id: bookId,
      copies: 5,
      synopsis: 'Um livro de ficção cientifica',
    });
    expect(updateBook).toEqual(
      expect.objectContaining({
        copies: 5,
        synopsis: 'Um livro de ficção cientifica',
      }),
    );
  });

  it('it should not be possible to update the datas of a book', async () => {
    try {
      await sut.execute({
        id: 'id-non-exists',
        copies: 5,
        synopsis: 'Um livro de ficção cientifica',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    }
  });
});
