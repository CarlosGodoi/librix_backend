import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { describe, it, beforeEach, expect } from 'vitest';
import { UpdateUserUserCase } from '../updateUser';
import { AppError } from '@/utils/errors/appError';

let usersRepository: InMemoryUsersRepository;
let sut: UpdateUserUserCase;

describe('Update User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateUserUserCase(usersRepository);
  });

  it('Should be able to update datas at user.', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: 'Test@123',
    });

    const userId = user.id;

    const updateUser = await sut.execute({
      id: userId,
      name: 'John Doe new',
      email: 'johndoe@hotmail.com',
      phone: '55 99988-9800',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      updatedAt: new Date(),
    });
    expect(updateUser).toEqual(
      expect.objectContaining({
        name: 'John Doe new',
        email: 'johndoe@hotmail.com',
        phone: '55 99988-9800',
      }),
    );
  });

  it('it should not be possible to update the datas of a user', async () => {
    try {
      await sut.execute({
        id: 'id-non-exists',
        name: 'John Doe new',
        email: 'johndoe@hotmail.com',
        phone: '55 99988-9800',
        profile: 'VISITOR',
        situation: 'ACTIVE',
        updatedAt: new Date(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    }
  });
});
