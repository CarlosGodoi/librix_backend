import type { NextFunction, Request, Response } from 'express';
import { registerUserBodySchema } from './schemas/userSchema';
import { makeRegisterUserUseCase } from '../../../use-cases/factories/make-register-user-use-case';
import { AppError } from '../../../utils/errors/appError';

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  const { name, email, phone, profile, situation, password } = registerUserBodySchema.parse(
    req.body,
  );

  try {
    const registerUserUseCase = makeRegisterUserUseCase();

    const user = await registerUserUseCase.execute({
      name,
      email,
      phone,
      profile,
      situation,
      password,
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
