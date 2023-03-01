import { getUserOrThrow } from '@lib/prisma';
import { Reaction } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const itemRouter = router({
  addReaction: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        type: z.enum([Reaction.LIKE, Reaction.DISLIKE]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = getUserOrThrow(ctx);

      const item = await ctx.prisma.item.findUnique({
        where: { id: input.id },
        select: { cycle: { select: { isPublic: true, createdBy: { select: { id: true } } } } },
      });

      if (!item || !item.cycle) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!item.cycle.isPublic && item.cycle.createdBy.id !== user?.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      await ctx.prisma.itemReaction.upsert({
        where: { userId_itemId: { itemId: input.id, userId: user.id } },
        create: {
          reactionType: input.type,
          item: { connect: { id: input.id } },
          user: { connect: { id: user.id } },
        },
        update: {
          reactionType: input.type,
        },
      });

      return true;
    }),
});
