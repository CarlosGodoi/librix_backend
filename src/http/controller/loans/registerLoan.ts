import type { NextFunction, Request, Response } from 'express';
import { registerLoanBodySchema } from './schema/registerLoanSchema';
import { makeRegisterLoanUseCase } from '@/use-cases/factories/make-loan-use-case';
import { AppError } from '@/utils/errors/appError';

export async function registerLoan(req: Request, res: Response, next: NextFunction) {
  const { bookId, userId, dueDate, loanDate, returnDate, status } = registerLoanBodySchema.parse(
    req.body,
  );

  const registerLoanUseCase = makeRegisterLoanUseCase();

  try {
    const loan = await registerLoanUseCase.execute({
      bookId,
      userId,
      dueDate,
      loanDate,
      returnDate,
      status,
    });

    return res.status(200).json(loan);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(400).send({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
}
