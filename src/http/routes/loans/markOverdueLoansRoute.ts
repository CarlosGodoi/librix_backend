import { markOverdueLoansController } from '@/http/controller/loans/markOverdueLoans';
import { Router } from 'express';

const internalRouter = Router();

internalRouter.post(
  '/loans/mark-overdue',
  (req, res, next) => {
    const secret = req.headers['x-cron-secret'];

    if (secret !== process.env.CRON_SECRET) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    next();
  },
  markOverdueLoansController,
);

export { internalRouter };
