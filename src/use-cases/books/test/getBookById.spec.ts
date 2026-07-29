import type { BooksRepository } from '@/repositories/books-repository';
import { describe, it, beforeEach, expect } from 'vitest';
import { RegisterBookUseCase } from '../registerBook';
import { GetBookByIdUseCase } from '../getBookById';
import { InMemoryBooksRepository } from '@/repositories/in-memory/in-memory-books-repository';
import { AppError } from '@/utils/errors/appError';

let booksRepository: BooksRepository;
let registerBookUseCase: RegisterBookUseCase;
let getBookById: GetBookByIdUseCase;

describe('Get Book By Id Use Case', () => {
  beforeEach(() => {
    booksRepository = new InMemoryBooksRepository();
    registerBookUseCase = new RegisterBookUseCase(booksRepository);
    getBookById = new GetBookByIdUseCase(booksRepository);
  });

  it('Should be able to list a book by id', async () => {
    const { book } = await registerBookUseCase.execute({
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

    const bookById = await getBookById.execute(book.id);

    expect(bookById).toBeTruthy();
    expect(bookById?.id).toEqual(book.id);
  });

  it('Should not be able to get book with wrong id', async () => {
    await expect(() => getBookById.execute('non-exists-id')).rejects.toBeInstanceOf(AppError);
  });
});
