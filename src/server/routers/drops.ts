import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { t } from '../trpc';

export const dropRouter = t.router({
  fetchById: t.procedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.session?.user;

      const drop = await ctx.prisma.drop.findUnique({
        where: { id: input.id },
        select: {
          box: { select: { name: true, id: true } },
          isPublic: true,
          createdBy: { select: { id: true } },
          items: {
            select: { id: true, content: true, createdBy: { select: { id: true, name: true } } },
          },
        },
      });

      if (!drop) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!drop.isPublic && drop.createdBy.id !== user?.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      return drop;
    }),
});
