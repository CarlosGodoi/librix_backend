import { makeGetLoansByUserIdUseCase } from '@/use-cases/factories/make-get-loans-by-user-id-use-case';
import { AppError } from '@/utils/errors/appError';
import { parsePagination } from '@/utils/parsePagination';
import type { NextFunction, Request, Response } from 'express';

interface ILoansByUserQueryParams {
  skip?: string;
  take?: string;
}

export async function getLoansByUserIdController(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params as { id: string };
  const { skip, take } = req.query as ILoansByUserQueryParams;

  try {
    const requesterId = req.user?.id;
    const requesterRole = req.user?.role;

    if (requesterRole === 'VISITOR' && requesterId !== id) {
      return res
        .status(403)
        .json({ message: "Permission denied. cannot access another user's loans." });
    }

    const getLoansByUserIdUseCase = makeGetLoansByUserIdUseCase();
    const pagination = parsePagination(skip, take);

    if (!pagination) {
      return res.status(400).json({ error: 'skip and take must be valid numbers.' });
    }

    const result = await getLoansByUserIdUseCase.execute(id, pagination);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(404).send({ message: error.message });
    }
    next(error);
  }
}
