import type { NextFunction, Request, Response } from 'express';
import { updateBookBodySchema } from './schema/updateBookSchema';
import { makeUpdateBookUseCase } from '@/use-cases/factories/make-update-boo-use-case';
import { AppError } from '@/utils/errors/appError';

export async function updateBookController(req: Request, res: Response, next: NextFunction) {
  const { copies, synopsis } = updateBookBodySchema.parse(req.body);

  try {
    const updateBookUseCase = makeUpdateBookUseCase();
    const { id } = req.params as { id: string };

    const book = await updateBookUseCase.execute({
      id,
      copies,
      synopsis,
    });

    return res.status(200).json(book);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(400).json({ error: error.message });
    } else {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
}
