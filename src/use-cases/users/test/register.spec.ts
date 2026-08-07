import { compare } from 'bcrypt';
import { InMemoryUsersRepository } from '../../../repositories/in-memory/in-memory-users-repository';
import { RegisterUserUserCase } from '../../users/register';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppError } from '../../../utils/errors/appError';
import type { UsersRepository } from '@/repositories/users-repository';

let usersRepository: UsersRepository;
let sut: RegisterUserUserCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserUserCase(usersRepository);
  });

  it('Shoulde be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: 'Test@123',
    });
    expect(user.id).toEqual(expect.any(String));
  });

  it('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: 'Test@123',
    });

    const isPasswordCorrectlyHashed = await compare('Test@123', user.password);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('Should not be able to register with same email twice', async () => {
    const email = 'johndoe@mail.com';

    await sut.execute({
      name: 'John Doe',
      email,
      phone: '55 99988-9809',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: 'Test@123',
    });

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        phone: '55 99988-9809',
        profile: 'VISITOR',
        situation: 'ACTIVE',
        password: 'Test@123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
