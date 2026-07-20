import express, { type Express } from 'express';
import { env } from '.';

export const app: Express = express();

app.set('jwtSecret', env.JWT_SECRET);
app.set('refreshTokenSecret', env.JWT_REFRESH_SECRET);
