import { getAllLoansController } from '@/http/controller/loans/getAllLoans';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const getAllLoansRouter = Router();

getAllLoansRouter.get(
  '/',
  autorize('LIBRARIAN'),
  async (req: Request, res: Response, next: NextFunction) => {
    await getAllLoansController(req, res, next);
  },
);

export { getAllLoansRouter };
