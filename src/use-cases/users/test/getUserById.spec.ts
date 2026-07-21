import type { UsersRepository } from '@/repositories/users-repository';
import { RegisterUserUserCase } from '../register';
import { GetUserByIdUseCase } from '../getUserById';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AppError } from '@/utils/errors/appError';

let usersRepository: UsersRepository;
let registerUserUseCase: RegisterUserUserCase;
let getUserByIdUSeCase: GetUserByIdUseCase;

describe('GetUserById Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerUserUseCase = new RegisterUserUserCase(usersRepository);
    getUserByIdUSeCase = new GetUserByIdUseCase(usersRepository);
  });

  it('Should be able to list a user by id', async () => {
    const role = 'ADMIN';

    const { user } = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: role,
      situation: 'ACTIVE',
      password: 'Test@123',
    });

    const userById = await getUserByIdUSeCase.execute(user.id);

    expect(userById).toBeTruthy();
    expect(userById?.id).toEqual(user.id);
  });

  it('Should not be able to get user with wrong id', async () => {
    await expect(() => getUserByIdUSeCase.execute('non-existent-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
