import { deleteUserController } from '@/http/controller/users/deleteUser';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const deleteUserRouter = Router();

deleteUserRouter.delete(
  '/delete/:id',
  autorize('ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    await deleteUserController(req, res, next);
  },
);

export { deleteUserRouter };
