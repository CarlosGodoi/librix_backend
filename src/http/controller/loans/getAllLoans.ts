import { makeGetAllLoansUseCase } from '@/use-cases/factories/make-get-all-loans-use-case';
import { parsePagination } from '@/utils/parsePagination';
import type { NextFunction, Request, Response } from 'express';
import { LoanStatus } from 'generated/prisma/enums';

interface ILoansQueryParams {
  skip?: string;
  take?: string;
  search?: string;
  status?: string;
}

export async function getAllLoansController(req: Request, res: Response, next: NextFunction) {
  const { skip, take, search, status } = req.query as ILoansQueryParams;

  const getAllLoansUseCase = makeGetAllLoansUseCase();

  const pagination = parsePagination(skip, take);

  if (!pagination) {
    return res.status(400).json({ error: 'skip and take must be valid numbers.' });
  }
  const result = await getAllLoansUseCase.execute(pagination);

  return res.status(200).json(result);
}
