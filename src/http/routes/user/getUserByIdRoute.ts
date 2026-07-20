import { getUserById } from '@/http/controller/users/getUserById';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const getUserByIdRouter = Router();

getUserByIdRouter.get(
  '/:id',
  autorize('ADMIN', 'LIBRARIAN'),
  async (req: Request, res: Response, next: NextFunction) => {
    await getUserById(req, res, next);
  },
);

export { getUserByIdRouter };
