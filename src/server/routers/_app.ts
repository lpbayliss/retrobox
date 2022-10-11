/**
 * This file contains the root router of your tRPC-backend
 */
import { t } from '../trpc';
import { boxRouter } from './boxes';
import { healthRouter } from './health';
import { userRouter } from './users';

export const appRouter = t.router({
  health: healthRouter,
  box: boxRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
