import { makeReturnLoanUseCase } from '@/use-cases/factories/make-return-loan-use-case';
import { AppError } from '@/utils/errors/appError';
import type { NextFunction, Request, Response } from 'express';
import z from 'zod';

const returnedLoanParamsSchema = z.object({
  id: z.string(),
});

export async function returnedLoanController(req: Request, res: Response, next: NextFunction) {
  const { id } = returnedLoanParamsSchema.parse(req.params);

  const returnedLoanUseCase = makeReturnLoanUseCase();

  try {
    await returnedLoanUseCase.execute({ id });

    return res.status(200).send({ message: 'Empréstimo devolvido com sucesso.' });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(400).send({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
}
