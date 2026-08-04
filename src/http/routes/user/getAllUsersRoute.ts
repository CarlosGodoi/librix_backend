import { getAllUsersController } from '@/http/controller/users/getAllUsers';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const getAllUsersRouter = Router();

getAllUsersRouter.get(
  '/',
  autorize('ADMIN', 'LIBRARIAN'),
  async (req: Request, res: Response, next: NextFunction) => {
    await getAllUsersController(req, res, next);
  },
);

export { getAllUsersRouter };
