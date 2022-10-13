/**
 * This file contains the root router of your tRPC-backend
 */
import { t } from '../trpc';
import { boxRouter } from './boxes';
import { dropRouter } from './drops';
import { healthRouter } from './health';
import { userRouter } from './users';

export const appRouter = t.router({
  health: healthRouter,
  box: boxRouter,
  user: userRouter,
  drop: dropRouter,
});

export type AppRouter = typeof appRouter;
