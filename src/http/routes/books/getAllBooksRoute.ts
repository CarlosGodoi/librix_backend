import { getAllBooksController } from '@/http/controller/books/getAllBooks';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const getAllBooksRouter = Router();

getAllBooksRouter.get(
  '/',
  autorize('ADMIN', 'LIBRARIAN', 'VISITOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    await getAllBooksController(req, res, next);
  },
);

export { getAllBooksRouter };
