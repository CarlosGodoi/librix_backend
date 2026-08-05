import z from 'zod';

export const updateBookBodySchema = z.object({
  copies: z.number(),
  synopsis: z.string().optional(),
});

export type UpdateBookBodySchema = z.infer<typeof updateBookBodySchema>;
