import type { Prisma, User } from '../../generated/prisma/client';
import type { IUpdatedUserDTO } from './dto/user-dto';
import type { IPagination } from './interface/pagination';

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  getAll(data: IPagination): Promise<{ total: number; users: User[]; totalPage?: number }>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(data: IUpdatedUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
}
