/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from '@prisma/client';
import { Context } from '@server/context';
import { TRPCError } from '@trpc/server';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}

export const getUserOrThrow = (ctx: Context) => {
  const user = ctx.session?.user;
  if (!user) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return user;
};