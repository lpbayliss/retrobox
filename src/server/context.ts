import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';

import { bullmq } from '../lib/bullmq';
import logger from '../lib/logger';
import { openai } from '../lib/openapi';
import { prisma } from '../lib/prisma';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req, res }: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({ req });
  const log = logger.child({ user: session?.user });
  return {
    req,
    res,
    prisma,
    session,
    log,
    openai,
    bullmq,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
