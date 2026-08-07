import type { BooksRepository } from '@/repositories/books-repository';
import { RegisterBookUseCase } from '../registerBook';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryBooksRepository } from '@/repositories/in-memory/in-memory-books-repository';

let booksRepository: BooksRepository;
let sut: RegisterBookUseCase;

describe('Register Book Use Case', () => {
  beforeEach(() => {
    booksRepository = new InMemoryBooksRepository();
    sut = new RegisterBookUseCase(booksRepository);
  });

  it('Should be able to register book', async () => {
    const { book } = await sut.execute({
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

    expect(book.id).toEqual(expect.any(String));
  });

  it('Should not be able to register a book with duplicated isbn', async () => {
    const ISBN = 'ISBN 999-999-99-00-5';

    await sut.execute({
      title: 'Book 1',
      author: 'Author 1',
      isbn: ISBN,
      publisher: 'Editora 1',
      category: 'Ficção',
      year: new Date(),
      copies: 2,
      synopsis: 'Um livro de ficção',
      coverUrl: '',
    });

    await expect(() =>
      sut.execute({
        title: 'Book 1',
        author: 'Author 1',
        isbn: ISBN,
        publisher: 'Editora 1',
        category: 'Ficção',
        year: new Date(),
        copies: 2,
        synopsis: 'Um livro de ficção',
        coverUrl: '',
      }),
    ).rejects.toEqual(
      expect.objectContaining({
        field: 'error',
        message: 'Book already exists.',
        statusCode: 400,
      }),
    );
  });
});
