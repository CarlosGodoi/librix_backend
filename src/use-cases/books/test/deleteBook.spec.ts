import { InMemoryBooksRepository } from '@/repositories/in-memory/in-memory-books-repository';
import { DeleteBookUseCase } from '../deleteBook';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppError } from '@/utils/errors/appError';

let bookRepository: InMemoryBooksRepository;
let sut: DeleteBookUseCase;

describe('Delete Book Use Case', () => {
  beforeEach(() => {
    bookRepository = new InMemoryBooksRepository();
    sut = new DeleteBookUseCase(bookRepository);
  });

  it('Should be able to delete a book', async () => {
    const book = await bookRepository.create({
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

    expect(() => sut.execute(book.id));
  });

  it(`You should not be able to delete a book when they don't have an ID`, async () => {
    await expect(() => sut.execute('non-existent-id')).rejects.toBeInstanceOf(AppError);
  });
});
