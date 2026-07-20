import { makeDeleteUserUseCase } from '@/use-cases/factories/make-delete-user-use-case';
import { AppError } from '@/utils/errors/appError';
import type { NextFunction, Request, Response } from 'express';

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const deleteUserUseCase = makeDeleteUserUseCase();

    const { id } = req.params as { id: string };

    await deleteUserUseCase.execute(id);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(404).send({ message: error.message });
    }

    throw error;
  }

  return res.status(200).send();
}
