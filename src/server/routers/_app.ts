/**
 * This file contains the root router of your tRPC-backend
 */
import { t } from '../trpc';
import { healthRouter } from './health';

export const appRouter = t.router({
  health: healthRouter,
});

export type AppRouter = typeof appRouter;