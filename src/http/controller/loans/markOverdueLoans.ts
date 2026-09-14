import { makeMarkOverdueLoansUseCase } from '@/use-cases/factories/make-mark-overdue-loans-use-case';
import type { NextFunction, Request, Response } from 'express';

export async function markOverdueLoansController(req: Request, res: Response, next: NextFunction) {
  const markOverdueLoansUseCase = makeMarkOverdueLoansUseCase();

  try {
    const result = await markOverdueLoansUseCase.execute();

    return res.status(200).send({
      message: 'Empréstimos em atraso atualizados com sucesso.',
      updated: result.count,
    });
  } catch (error) {
    next(error);
  }
}
