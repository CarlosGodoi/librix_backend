import { registerBookController } from '@/http/controller/books/registerBook';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const registerBookRouter = Router();

registerBookRouter.post(
  '/register',
  autorize('ADMIN', 'LIBRARIAN'),
  async (req: Request, res: Response, next: NextFunction) => {
    await registerBookController(req, res, next);
  },
);

export { registerBookRouter };
