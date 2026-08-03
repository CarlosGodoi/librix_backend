import type { LoansRepository } from '@/repositories/loans-repository';
import { describe, it, beforeEach, expect } from 'vitest';

import { InMemoryLoansRepository } from '@/repositories/in-memory/in-memory-loans-repository';
import type { BooksRepository } from '@/repositories/books-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import { InMemoryBooksRepository } from '@/repositories/in-memory/in-memory-books-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { ReturnedLoansUseCase } from '../returnedLoan';
import { RegisterLoanUseCase } from '../registerLoan';
import { AppError } from '@/utils/errors/appError';

let loansRepository: LoansRepository;
let usersRepository: UsersRepository;
let booksRepository: BooksRepository;
let registerLoanUseCase: RegisterLoanUseCase;
let sut: ReturnedLoansUseCase;

describe('Returned Loan Use Case', () => {
  beforeEach(() => {
    loansRepository = new InMemoryLoansRepository();
    usersRepository = new InMemoryUsersRepository();
    booksRepository = new InMemoryBooksRepository();
    registerLoanUseCase = new RegisterLoanUseCase(
      loansRepository,
      usersRepository,
      booksRepository,
    );
    sut = new ReturnedLoansUseCase(loansRepository);
  });

  it('Should be able to return a loan', async () => {
    const user = await usersRepository.create({
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

    const { loan } = await registerLoanUseCase.execute({
      bookId: book.id,
      userId: user.id,
      loanDate: new Date('2026-08-01'),
      dueDate: new Date('2026-08-10'),
    });

    const result = await sut.execute({
      id: loan.id,
    });

    expect(result.status).toEqual('RETURNED');
    expect(result.returnDate).toBeInstanceOf(Date);
  });

  it('Should not be possible to return book that has already been returned.', async () => {
    const user = await usersRepository.create({
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

    const { loan } = await registerLoanUseCase.execute({
      bookId: book.id,
      userId: user.id,
      loanDate: new Date('2026-08-01'),
      dueDate: new Date('2026-08-10'),
    });

    const result = await sut.execute({
      id: loan.id,
    });

    expect(result.status).toEqual('RETURNED');
    expect(result.returnDate).toBeInstanceOf(Date);

    await expect(() =>
      sut.execute({
        id: loan.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to return book with wrong id', async () => {
    await expect(() => sut.execute({ id: 'non-exists-id' })).rejects.toBeInstanceOf(AppError);
  });
});
