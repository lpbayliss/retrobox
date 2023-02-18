import { getUserOrThrow } from '@lib/prisma';
import { Reaction } from '@prisma/client';
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
