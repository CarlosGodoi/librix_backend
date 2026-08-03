import { getAllUsersController } from '@/http/controller/users/getAllUsers';
import { Router } from 'express';

const getAllUsersRouter = Router();

getAllUsersRouter.get('/', async (req, res, next) => {
  await getAllUsersController(req, res, next);
});

export { getAllUsersRouter };
