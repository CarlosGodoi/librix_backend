import { getBookByIdController } from '@/http/controller/books/getBookById';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const getBookByIdRouter = Router();

getBookByIdRouter.get(
  '/:id',
  autorize('ADMIN', 'LIBRARIAN', 'VISITOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    await getBookByIdController(req, res, next);
  },
);

export { getBookByIdRouter };
