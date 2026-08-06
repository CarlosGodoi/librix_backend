import type { NextFunction, Request, Response } from 'express';
import { registerBookBodySchema } from './schema/registerBookSchema';
import { makeRegisterBookUseCase } from '@/use-cases/factories/make-register-book-use-case';
import { AppError } from '@/utils/errors/appError';

export async function registerBookController(req: Request, res: Response, next: NextFunction) {
  const { title, author, isbn, publisher, category, year, copies, synopsis, coverUrl } =
    registerBookBodySchema.parse(req.body);

  try {
    const registerBookUseCase = makeRegisterBookUseCase();

    const book = await registerBookUseCase.execute({
      title,
      author,
      isbn,
      publisher,
      category,
      year: year ? new Date(year) : new Date(0),
      copies,
      synopsis: synopsis || '',
      coverUrl: coverUrl || '',
    });

    return res.status(200).json(book);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
}
