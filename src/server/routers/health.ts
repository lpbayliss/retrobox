import { TRPCError } from '@trpc/server';
import { prisma } from 'src/lib/prisma';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

const getIsDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    return false;
  }
};

export const healthRouter = router({
  health: publicProcedure.input(z.string()).query(async ({ ctx }) => {
    if (!process.env.HEALTH_API_KEY || ctx.req.headers.authorization !== process.env.HEALTH_API_KEY)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    return {
      server: true,
      database: await getIsDatabaseHealth(),
      env: process.env,
    };
  }),
});
