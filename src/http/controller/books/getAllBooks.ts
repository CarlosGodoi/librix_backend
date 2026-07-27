import { makeGetAllBooksUseCase } from '@/use-cases/factories/make-get-all-books-use-case';
import type { NextFunction, Request, Response } from 'express';

interface IUserQueryParams {
  skip?: string;
  take?: string;
  search?: string;
}

export async function getAllBooks(req: Request, res: Response, Nex: NextFunction) {
  const { skip, take, search } = req.query as IUserQueryParams;

  const getAllBooksUsecase = makeGetAllBooksUseCase();

  const result = await getAllBooksUsecase.execute({
    skip: skip ? Number(skip) : 1,
    take: take ? Number(take) : 10,
    search,
  });

  return res.status(200).json(result);
}
