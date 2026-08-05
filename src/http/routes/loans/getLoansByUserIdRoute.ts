import { getLoansByUserIdController } from '@/http/controller/loans/loansByUserId';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const getLoansByUserIdRouter = Router();

getLoansByUserIdRouter.get(
  '/user/:id',
  autorize('VISITOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    await getLoansByUserIdController(req, res, next);
  },
);

export { getLoansByUserIdRouter };
