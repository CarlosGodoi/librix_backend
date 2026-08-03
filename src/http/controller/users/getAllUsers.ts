import { makeGetAllUsersUseCase } from '@/use-cases/factories/make-get-all-users-use-case';
import type { NextFunction, Request, Response } from 'express';

interface IUserQueryParams {
  skip?: string;
  take?: string;
  search?: string;
}

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {
  const { take, skip, search } = req.query as IUserQueryParams;

  const getAllUsersUseCase = makeGetAllUsersUseCase();

  const result = await getAllUsersUseCase.execute({
    skip: skip ? Number(skip) : 1,
    take: take ? Number(take) : 10,
    search,
  });

  return res.status(200).json(result);
}
