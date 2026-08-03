import { returnedLoanController } from '@/http/controller/loans/returnedLoan';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const returnedLoanRouter = Router();

returnedLoanRouter.patch(
  '/return/:id',
  autorize('LIBRARIAN'),
  async (req: Request, res: Response, next: NextFunction) => {
    await returnedLoanController(req, res, next);
  },
);

export { returnedLoanRouter };
