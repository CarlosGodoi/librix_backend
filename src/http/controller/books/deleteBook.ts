import { makeDeleteBookUseCase } from '@/use-cases/factories/make-delete-book-use-case';
import { AppError } from '@/utils/errors/appError';
import type { NextFunction, Request, Response } from 'express';

export async function deleteBookController(req: Request, res: Response, next: NextFunction) {
  try {
    const deleteBookUseCase = makeDeleteBookUseCase();

    const { id } = req.params as { id: string };

    await deleteBookUseCase.execute(id);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(404).send({ message: error.message });
    }

    next(error);
  }

  return res.status(200).send();
}
