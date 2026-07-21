import { AppError } from '@/utils/errors/appError';
import type { Prisma, User } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import type { IUpdatedUserDTO } from '../dto/user-dto';
import type { IPagination } from '../interface/pagination';
import type { UsersRepository } from '../users-repository';

const Pagination = (skip: number, take: number) => {
  const calcSkip = (skip - 1) * take;

  const pagination = {
    skip: calcSkip < 0 ? 0 : calcSkip,
    take,
  };

  return pagination;
};

export interface GetAllParams {
  skip?: number;
  take?: number;
  search?: string;
}

export interface IUsersParamsGetAll extends IPagination {
  users: User[];
  total: number;
  totalPage?: number;
}

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async getAll({ skip, take, search }: GetAllParams): Promise<IUsersParamsGetAll> {
    let pagination: IPagination = {};

    if (skip && take) {
      pagination = Pagination(skip, take);
    }

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          {
            name: {
              startsWith: search,
            },
          },
        ],
      }),
    };

    const user = await prisma.user.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      skip: pagination.skip,
      take: pagination.take,
    });

    const total = await prisma.user.count({ where });
    const totalPage = take ? Math.ceil(total / take) : total;

    return {
      users: user,
      total,
      ...(pagination.take && { totalPage }),
    };
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async findById(id: string) {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    return user;
  }

  async update(data: IUpdatedUserDTO) {
    const user = await prisma.user.update({
      where: {
        id: data.id ? data.id : '',
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        profile: data.profile,
        situation: data.situation,
        updatedAt: new Date(),
      },
    });

    return user;
  }

  async delete(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError('error', 'User not found.');
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
