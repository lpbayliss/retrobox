import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const cycleRouter = router({
  fetchById: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.session?.user;

      const cycle = await ctx.prisma.cycle.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          project: { select: { name: true, id: true } },
          isPublic: true,
          createdBy: { select: { id: true } },
          items: {
            select: { id: true, content: true, createdBy: { select: { id: true, name: true } } },
          },
        },
      });

      if (!cycle) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!cycle.isPublic && cycle.createdBy.id !== user?.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      return cycle;
    }),
});
