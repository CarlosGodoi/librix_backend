import z from 'zod';

export const getRecommendationParamsSchema = z.object({
  userId: z.string(),
});

export type GetRecommendationsParamsSchema = z.infer<typeof getRecommendationParamsSchema>;
