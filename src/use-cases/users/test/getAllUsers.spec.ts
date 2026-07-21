import type { UsersRepository } from '@/repositories/users-repository';
import { RegisterUserUserCase } from '../register';
import { GetAllUsersUseCase } from '../getAllUsers';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

let usersRepository: UsersRepository;
let registerUserUseCase: RegisterUserUserCase;
let getAllUsersUseCase: GetAllUsersUseCase;

describe('GetAllUsers Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerUserUseCase = new RegisterUserUserCase(usersRepository);
    getAllUsersUseCase = new GetAllUsersUseCase(usersRepository);
  });

  it('Should be able to list users', async () => {
    const role = 'ADMIN';

    const { user } = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      phone: '55 99988-9809',
      profile: role,
      situation: 'ACTIVE',
      password: 'Test@123',
    });
    expect(user.profile).toBe(role);

    await registerUserUseCase.execute({
      name: 'user-2',
      email: 'user2@mail.com',
      phone: '55 89788-9809',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: 'User2@123',
    });

    await registerUserUseCase.execute({
      name: 'user-3',
      email: 'user3@mail.com',
      phone: '55 94732-3244',
      profile: 'VISITOR',
      situation: 'ACTIVE',
      password: 'User3@123',
    });

    const allUsers = await getAllUsersUseCase.execute({
      take: 2,
      skip: 1,
      search: '',
    });

    expect(allUsers.total).toBe(3);
    expect(allUsers.users.length).toBe(2);
  });
});
