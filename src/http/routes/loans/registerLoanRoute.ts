import { registerLoanController } from '@/http/controller/loans/registerLoan';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const registerLoanRouter = Router();

registerLoanRouter.post(
  '/register',
  autorize('LIBRARIAN', 'ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    await registerLoanController(req, res, next);
  },
);

export { registerLoanRouter };
