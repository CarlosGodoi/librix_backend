import { getBookRecommendationsController } from '@/http/controller/books/getBookRecommendations';
import { autorize } from '@/http/middlewares/autorize';
import { Router, type NextFunction, type Request, type Response } from 'express';

const getBooksRecommendationsRouter = Router();

getBooksRecommendationsRouter.get(
  '/recommendations/:userId',
  autorize('VISITOR'),
  async (req: Request, res: Response, next: NextFunction) => {
    await getBookRecommendationsController(req, res, next);
  },
);

export { getBooksRecommendationsRouter };
