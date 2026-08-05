import { updateBookController } from '@/http/controller/books/updateBook';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const updateBookRouter = Router();

updateBookRouter.put(
  '/update/:id',
  autorize('ADMIN', 'LIBRARIAN'),
  async (req: Request, res: Response, next: NextFunction) => {
    await updateBookController(req, res, next);
  },
);

export { updateBookRouter };
