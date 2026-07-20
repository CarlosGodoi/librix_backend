import { z } from 'zod';

export const authBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type AuthBodySchema = z.infer<typeof authBodySchema>;
