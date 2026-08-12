import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './docs/swagger.json';
import { app } from './config/app.ts';
import { AppError } from './utils/errors/appError.ts';
import { Prisma } from '../generated/prisma/client.ts';
import { prisma } from './lib/prisma.ts';
import { env } from './config/index.ts';
import { router } from './http/routes/index.ts';
import { callbackify } from 'node:util';

const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('error', error);

  if (error instanceof AppError) {
    const errors = [
      {
        message: error.message,
        field: error.field,
      },
    ];
    res.status(error.statusCode).json(errors);
    return;
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    console.log('db error =>', error.message);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log('db error =>', error.message);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    console.log('db error =>', error.message);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.log('db error =>', error.message);
  }

  res.status(500).json({ status: 'error', message: 'Internal Server Error.' });
};

const allowedOrigins = ['http://localhost:3000', 'https://librix-blue.vercel.app'];

prisma
  .$connect()
  .then(() => {
    console.log('Dadabase has connected.');

    app.use(
      cors({
        origin: (origin, callbackify) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callbackify(null, true);
          } else {
            callbackify(new Error('Not allowed by CORS.'));
          }
        },
        credentials: true,
      }),
    );
    app.use(express.json());

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    app.use(router);
    app.use(errorHandler);

    app.listen(env.PORT, () =>
      console.log(
        `Server is running on port ${env.PORT} 🚀\nAPI documentation => ${env.APP_HOST}/api-docs`,
      ),
    );
  })
  .catch((err) => {
    console.log('ERROR DATABASE', err.message);
  });
