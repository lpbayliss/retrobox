/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from '../trpc';
import { cycleRouter } from './cycles';
import { healthRouter } from './health';
import { itemRouter } from './items';
import { projectRouter } from './projects';
import { userRouter } from './users';

export const appRouter = router({
  health: healthRouter,
  project: projectRouter,
  user: userRouter,
  cycle: cycleRouter,
  item: itemRouter,
});

export type AppRouter = typeof appRouter;
