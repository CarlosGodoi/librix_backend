import type { BooksRepository } from '@/repositories/books-repository';
import type { LoansRepository } from '@/repositories/loans-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import { describe, it, beforeEach, expect } from 'vitest';
import { GetAllLoansUseCase } from '../getAllLoans';
import { InMemoryBooksRepository } from '@/repositories/in-memory/in-memory-books-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InMemoryLoansRepository } from '@/repositories/in-memory/in-memory-loans-repository';

let booksRepository: BooksRepository;
let userRepository: UsersRepository;
let loansRepository: LoansRepository;
let sut: GetAllLoansUseCase;

describe('Get All Loans Use Case', () => {
  beforeEach(() => {
    booksRepository = new InMemoryBooksRepository();
    userRepository = new InMemoryUsersRepository();
    loansRepository = new InMemoryLoansRepository();
    sut = new GetAllLoansUseCase(loansRepository);
  });

  it('Should be able to list all book loans.', async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: 'Test@123',
    });

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

    await loansRepository.create({
      book: {
        connect: {
          id: book.id,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
      dueDate: new Date('2026-08-07'),
      loanDate: new Date('2026-07-29'),
      status: 'INPROGRESS',
    });

    const allLoans = await sut.execute({
      skip: 0,
      take: 2,
      search: '',
    });

    expect(allLoans.total).toBe(1);
    expect(allLoans.loans.length).toBe(1);
  });
});
