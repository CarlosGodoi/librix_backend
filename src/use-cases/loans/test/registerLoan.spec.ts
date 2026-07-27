import type { LoansRepository } from '@/repositories/loans-repository';
import { it, beforeEach, expect, describe } from 'vitest';
import { RegisterLoanUseCase } from '../registerLoan';
import type { UsersRepository } from '@/repositories/users-repository';
import type { BooksRepository } from '@/repositories/books-repository';
import { InMemoryLoansRepository } from '@/repositories/in-memory/in-memory-loans-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InMemoryBooksRepository } from '@/repositories/in-memory/in-memory-books-repository';

let loansRepository: LoansRepository;
let usersRepository: UsersRepository;
let booksRepository: BooksRepository;
let sut: RegisterLoanUseCase;

describe('Register Loan Use Case', () => {
  beforeEach(() => {
    loansRepository = new InMemoryLoansRepository();
    usersRepository = new InMemoryUsersRepository();
    booksRepository = new InMemoryBooksRepository();

    sut = new RegisterLoanUseCase(loansRepository, usersRepository, booksRepository);
  });

  it('Should be able to register a loan', async () => {
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

    const { loan } = await sut.execute({
      bookId: book.id,
      userId: user.id,
      dueDate: new Date('03/08/2026'),
      loanDate: new Date('27/07/2026'),
      returnDate: new Date('03/08/2026'),
      status: 'INPROGRESS',
    });
    expect(loan.id).toEqual(expect.any(String));
  });
});
