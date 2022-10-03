import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { Context } from '../context';
import { t } from '../trpc';

const defaultBoxSelect = Prisma.validator<Prisma.BoxSelect>()({
  id: true,
  name: true,
  team: true,
  createdBy: true,
  items: true,
});

const boxWhereUserIsOwnerInput = (userId: string) =>
  Prisma.validator<Prisma.BoxWhereInput>()({
    userId,
  });

const getUserOrThrow = (ctx: Context) => {
  const user = ctx.session?.user;
  if (!user) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return user;
};

export const boxRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        name: z.string().min(1),
        teamId: z.string().cuid().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = getUserOrThrow(ctx);
      const box = await ctx.prisma.box.create({
        data: {
          ...input,
          userId: user.id,
        },
        select: defaultBoxSelect,
      });
      return box;
    }),
  fetchAll: t.procedure.query(async ({ ctx }) => {
    const user = getUserOrThrow(ctx);
    const boxes = await ctx.prisma.box.findMany({
      where: boxWhereUserIsOwnerInput(user.id),
      select: defaultBoxSelect,
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return boxes;
  }),
});
