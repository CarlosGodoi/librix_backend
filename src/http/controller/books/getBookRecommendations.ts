import type { NextFunction, Request, Response } from 'express';
import { getRecommendationParamsSchema } from './schema/getRecommendationsSchema';
import { makeGetBookRecommendationsUseCase } from '@/use-cases/factories/make-get-book-recommendations-use-case';

export async function getBookRecommendationsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = getRecommendationParamsSchema.parse(req.params);

  const getBookRecommendationsUseCase = makeGetBookRecommendationsUseCase();

  const result = await getBookRecommendationsUseCase.execute({ userId });

  return res.status(200).json(result);
}
