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
  health: t.procedure.query(async () => ({
    server: true,
    database: await getIsDatabaseHealth(),
  })),
});
