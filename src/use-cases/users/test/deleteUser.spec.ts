import type { UsersRepository } from '@/repositories/users-repository';
import { RegisterUserUserCase } from '../register';
import { DeleteUserUseCase } from '../deleteUser';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AppError } from '@/utils/errors/appError';

let usersRepository: UsersRepository;
let sut: RegisterUserUserCase;
let deleteUserUseCase: DeleteUserUseCase;

describe('Delete User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserUserCase(usersRepository);
    deleteUserUseCase = new DeleteUserUseCase(usersRepository);
  });

  it('Should be able to delete a user', async () => {
    const role = 'ADMIN';

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: role,
      situation: 'ACTIVE',
      password: 'Test@123',
    });

    expect(() => deleteUserUseCase.execute(user.id));
  });

  it(`You should not be able to delete a user when they don't have an ID`, async () => {
    await expect(() => deleteUserUseCase.execute('non-existent-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
