import { deleteUser } from '@/http/controller/users/deleteUser';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const deleteUserRouter = Router();

deleteUserRouter.delete(
  '/delete/:id',
  autorize('ADMIN', 'LIBRARIAN'),
  async (req: Request, res: Response, next: NextFunction) => {
    await deleteUser(req, res, next);
  },
);

export { deleteUserRouter };
