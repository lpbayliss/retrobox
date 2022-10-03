import { TRPCError } from '@trpc/server';
import { prisma } from 'src/lib/prisma';

import { t } from '../trpc';

const getIsDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    return false;
  }
};

export const healthRouter = t.router({
  health: t.procedure.query(async ({ ctx }) => {
    if (!process.env.HEALTH_API_KEY || ctx.req.headers.authorization !== process.env.HEALTH_API_KEY)
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    return {
      server: true,
      database: await getIsDatabaseHealth(),
      env: process.env,
    };
  }),
});
