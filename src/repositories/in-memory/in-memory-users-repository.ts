import { Status, type User } from '../../../generated/prisma/client';
import type { UserCreateInput } from '../../../generated/prisma/models';
import { AppError } from '../../utils/errors/appError';
import type { IUpdatedUserDTO } from '../dto/user-dto';
import type { IPagination } from '../interface/pagination';
import type { GetAllParams } from '../prisma/types/getAllParams';
import type { UsersRepository } from '../users-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(data: UserCreateInput) {
    const user = {
      id: data.id || 'user-1',
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      profile: data.profile,
      situation: data.situation ?? Status.ACTIVE,
      createdAt: new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    };

    this.items.push(user);

    return user;
  }

  async getAll({ skip = 0, take = 10, search }: GetAllParams) {
    let filteredItems = this.items;

    if (search) {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().startsWith(search.toLowerCase()),
      );
    }

    const startIndex = skip;
    const endIndex = skip + take;

    const total = filteredItems.length;
    const totalPage = Math.ceil(total / take);

    const users = filteredItems.slice(startIndex, endIndex);

    return { total, users, totalPage };
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!email) {
      return null;
    }

    return user || null;
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);

    if (!id) {
      return null;
    }

    return user || null;
  }

  async update(data: IUpdatedUserDTO) {
    const existingIndex = this.items.findIndex((item) => item.id === data.id);

    if (existingIndex === -1) {
      throw new AppError('error', `User with ID ${data.id} not found.`);
    }

    const existingUser = this.items[existingIndex];

    const updatedUser: User = {
      ...existingUser,
      name: data.name,
      phone: data.phone,
      email: data.email,
      profile: data.profile,
      situation: data.situation,
    };

    this.items[existingIndex] = updatedUser;

    return updatedUser;
  }

  async delete(id: string) {
    const existingIndex = this.items.findIndex((item) => item.id === id);

    if (existingIndex === -1) {
      throw new AppError('error', 'User not found.');
    }

    this.items.splice(existingIndex, 1);
  }
}
