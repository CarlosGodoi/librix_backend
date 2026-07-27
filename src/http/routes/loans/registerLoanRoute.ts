import { registerLoan } from '@/http/controller/loans/registerLoan';
import { Router, type NextFunction, type Request, type Response } from 'express';

const registerLoanRouter = Router();

registerLoanRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  await registerLoan(req, res, next);
});

export { registerLoanRouter };
