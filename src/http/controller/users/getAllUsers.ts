import { makeGetAllUsersUseCase } from '@/use-cases/factories/make-get-all-users-use-case';
import { parsePagination } from '@/utils/parsePagination';
import type { NextFunction, Request, Response } from 'express';

interface IUserQueryParams {
  skip?: string;
  take?: string;
  search?: string;
}

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {
  const { take, skip, search } = req.query as IUserQueryParams;

  try {
    const getAllUsersUseCase = makeGetAllUsersUseCase();

    const pagination = parsePagination(skip, take);

    if (!pagination) {
      return res.status(400).json({ error: 'skip and take must be valid numbers.' });
    }

    const result = await getAllUsersUseCase.execute({
      ...pagination,
      search,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
