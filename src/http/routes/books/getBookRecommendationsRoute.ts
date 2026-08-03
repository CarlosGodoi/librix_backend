import { getBookRecommendationsController } from '@/http/controller/books/getBookRecommendations';
import { Router } from 'express';

const getBooksRecommendationsRouter = Router();

getBooksRecommendationsRouter.get('/recommendations/:userId', async (req, res, next) => {
  await getBookRecommendationsController(req, res, next);
});

export { getBooksRecommendationsRouter };
