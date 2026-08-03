import { makeGetBookByIdUseCase } from '@/use-cases/factories/make-get-book-by-id-use-case';
import type { Request, Response, NextFunction } from 'express';

export async function getBookByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const getBookByIdUseCase = makeGetBookByIdUseCase();

    const { id } = req.params as { id: string };

    const book = await getBookByIdUseCase.execute(id);

    return res.status(200).send({ book });
  } catch (error) {
    if (error) {
      return res.status(409).send({ message: error });
    }
  }
}
