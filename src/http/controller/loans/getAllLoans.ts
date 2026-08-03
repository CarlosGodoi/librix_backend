import { makeGetAllLoansUseCase } from '@/use-cases/factories/make-get-all-loans-use-case';
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

  const result = await getAllLoansUseCase.execute({
    skip: skip ? Number(skip) : 1,
    take: take ? Number(take) : 10,
    search,
    status: status ? LoanStatus[status as keyof typeof LoanStatus] : undefined,
  });

  return res.status(200).json(result);
}
