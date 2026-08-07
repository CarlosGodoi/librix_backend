import type { BooksRepository } from '@/repositories/books-repository';
import type { LoansRepository } from '@/repositories/loans-repository';
import type { UsersRepository } from '@/repositories/users-repository';
import { describe, it, beforeEach, expect } from 'vitest';
import { InMemoryBooksRepository } from '@/repositories/in-memory/in-memory-books-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InMemoryLoansRepository } from '@/repositories/in-memory/in-memory-loans-repository';
import { GetLoansByUserIdUseCase } from '../loansByUserId';

let booksRepository: BooksRepository;
let userRepository: UsersRepository;
let loansRepository: LoansRepository;
let sut: GetLoansByUserIdUseCase;

describe('Get Loans By User Id Use Case', () => {
  beforeEach(() => {
    booksRepository = new InMemoryBooksRepository();
    userRepository = new InMemoryUsersRepository();
    loansRepository = new InMemoryLoansRepository();
    sut = new GetLoansByUserIdUseCase(loansRepository);
  });

  it(`Should be able to list all of the user's book loans.`, async () => {
    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: 'Test@123',
    });

    const userId = user.id;

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

    const book2 = await booksRepository.create({
      title: 'Book 2',
      author: 'Author 2',
      isbn: 'ISBN 888-888-99-00-5',
      publisher: 'Editora 2',
      category: 'Ciência',
      year: new Date(),
      copies: 2,
      synopsis: 'Um livro de ciência',
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

    await loansRepository.create({
      book: {
        connect: {
          id: book2.id,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
      dueDate: new Date('2026-07-20'),
      loanDate: new Date('2026-07-12'),
      status: 'INPROGRESS',
    });

    const loansByUser = await sut.execute(userId, {
      skip: 1,
      take: 5,
    });

    expect(loansByUser.total).toBe(2);
    expect(loansByUser.loans.length).toBe(1);
  });

  it(`Should not include loans from other users.`, async () => {
    const user1 = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: 'Test@123',
    });

    const user2 = await userRepository.create({
      name: 'Jane Smith',
      email: 'janesmith@mail.com',
      phone: '55 99977-8899',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: 'Test@123',
    });

    const book1 = await booksRepository.create({
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

    const book2 = await booksRepository.create({
      title: 'Book 2',
      author: 'Author 2',
      isbn: 'ISBN 888-888-99-00-5',
      publisher: 'Editora 2',
      category: 'Ciência',
      year: new Date(),
      copies: 2,
      synopsis: 'Um livro de ciência',
      coverUrl: '',
    });

    await loansRepository.create({
      book: { connect: { id: book1.id } },
      user: { connect: { id: user1.id } },
      dueDate: new Date('2026-08-07'),
      loanDate: new Date('2026-07-29'),
      status: 'INPROGRESS',
    });

    await loansRepository.create({
      book: { connect: { id: book2.id } },
      user: { connect: { id: user2.id } },
      dueDate: new Date('2026-07-20'),
      loanDate: new Date('2026-07-12'),
      status: 'INPROGRESS',
    });

    const loansByUser1 = await sut.execute(user1.id, {
      skip: 0,
      take: 5,
    });

    expect(loansByUser1.total).toBe(1);
    expect(loansByUser1.loans.length).toBe(1);
    expect(loansByUser1.loans[0].userId).toBe(user1.id);
    expect(loansByUser1.loans[0].bookId).toBe(book1.id);
  });
});
