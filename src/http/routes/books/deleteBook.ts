import { deleteBookController } from '@/http/controller/books/deleteBook';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const deleteBookRouter = Router();

deleteBookRouter.delete(
  '/delete/:id',
  autorize('ADMIN', 'LIBRARIAN'),
  async (req: Request, res: Response, next: NextFunction) => {
    await deleteBookController(req, res, next);
  },
);

export { deleteBookRouter };
