import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from '../authenticate';
import { beforeEach, describe, expect, it } from 'vitest';
import { hash } from 'bcrypt';
import { AppError } from '@/utils/errors/appError';
import type { UsersRepository } from '@/repositories/users-repository';

let usersRpository: UsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRpository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRpository);
  });

  it('Shoulde be able to authenticate', async () => {
    await usersRpository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: await hash('Test@123', 8),
      createdAt: new Date(),
    });

    const { user } = await sut.execute({
      email: 'johndoe@mail.com',
      password: 'Test@123',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('Shoulde not be able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'johndoe@mail.com',
        password: 'Test@123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    await usersRpository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: await hash('Test@123', 8),
    });

    expect(() => {
      sut.execute({
        email: 'johndoe@mail.com',
        password: '123123',
      });
    });
  });
});
