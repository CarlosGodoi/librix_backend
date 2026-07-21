import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../utils/errors/appError';
import { updateUserBodySchema } from './schemas/updateUserSchema';
import { makeUpdateUserUseCase } from '@/use-cases/factories/make-update-user-use-case';

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  const { name, email, phone, profile, situation, updatedAt } = updateUserBodySchema.parse(
    req.body,
  );

  try {
    const updateUserUseCase = makeUpdateUserUseCase();
    const { id } = req.params as { id: string };

    const user = await updateUserUseCase.execute({
      id,
      name,
      email,
      phone,
      profile,
      situation,
      updatedAt: updatedAt ? updatedAt : new Date(),
    });

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(400).json({ error: error.message });
    } else {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}
