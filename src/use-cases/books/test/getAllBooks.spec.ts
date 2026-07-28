import type { BooksRepository } from '@/repositories/books-repository';
import { describe, it, beforeEach, expect } from 'vitest';
import { GetAllBooksUseCase } from '../getAllBooks';
import { InMemoryBooksRepository } from '@/repositories/in-memory/in-memory-books-repository';
import { RegisterBookUseCase } from '../registerBook';

let booksRepository: BooksRepository;
let registerBookUseCase: RegisterBookUseCase;
let sut: GetAllBooksUseCase;

describe('Get All Books Use Case', () => {
  beforeEach(() => {
    booksRepository = new InMemoryBooksRepository();
    registerBookUseCase = new RegisterBookUseCase(booksRepository);
    sut = new GetAllBooksUseCase(booksRepository);
  });

  it('Should be able to list books', async () => {
    await registerBookUseCase.execute({
      title: 'Book 1',
      author: 'Author 1',
      isbn: 'ISBN 999-999-99-00-9',
      publisher: 'Editora 1',
      category: 'Ficção',
      year: new Date(),
      copies: 2,
      synopsis: 'Um livro de ficção',
      coverUrl: '',
    });

    await registerBookUseCase.execute({
      title: 'Book 2',
      author: 'Author 2',
      isbn: 'ISBN 999-988-88-00-8',
      publisher: 'Editora 2',
      category: 'Romance',
      year: new Date(),
      copies: 1,
      synopsis: 'Um livro de romance',
      coverUrl: '',
    });

    const allBooks = await sut.execute({
      take: 2,
      skip: 1,
      search: '',
    });

    expect(allBooks.total).toBe(2);
    expect(allBooks.books.length).toBe(1);
  });

  it('Should be able to filter books by search', async () => {
    await registerBookUseCase.execute({
      title: 'Clean Code',
      author: 'Robert Martin',
      isbn: 'ISBN 111-111-11-00-1',
      publisher: 'Editora 1',
      category: 'Tecnologia',
      year: new Date(),
      copies: 2,
      synopsis: 'Sobre código limpo',
      coverUrl: '',
    });

    await registerBookUseCase.execute({
      title: 'Design Patterns',
      author: 'Erich Gamma',
      isbn: 'ISBN 222-222-22-00-2',
      publisher: 'Editora 2',
      category: 'Tecnologia',
      year: new Date(),
      copies: 1,
      synopsis: 'Sobre padrões de projeto',
      coverUrl: '',
    });

    const result = await sut.execute({
      take: 10,
      skip: 0,
      search: 'Clean',
    });

    expect(result.total).toBe(1);
    expect(result.books.length).toBe(1);
    expect(result.books[0].title).toBe('Clean Code');
  });
});
