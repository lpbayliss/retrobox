/**
 * This file contains the root router of your tRPC-backend
 */
import { t } from '../trpc';
import { boxRouter } from './boxes';
import { healthRouter } from './health';

export const appRouter = t.router({
  health: healthRouter,
  box: boxRouter,
});

export type AppRouter = typeof appRouter;
