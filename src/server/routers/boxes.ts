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
  drops: true,
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
  fetchById: t.procedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = getUserOrThrow(ctx);
      const box = await ctx.prisma.box.findUnique({
        where: { id: input.id },
        select: defaultBoxSelect,
      });
      if (box?.createdBy.id !== user.id) throw new TRPCError({ code: 'FORBIDDEN' });
      return box;
    }),
  setViewed: t.procedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = getUserOrThrow(ctx);
      await ctx.prisma.boxViews.upsert({
        where: { userId_boxId: { boxId: input.id, userId: user.id } },
        create: { viewedAt: new Date(), boxId: input.id, userId: user.id },
        update: { viewedAt: new Date() },
      });
      return true;
    }),
  fetchAll: t.procedure.query(async ({ ctx }) => {
    const user = getUserOrThrow(ctx);
    const boxes = await ctx.prisma.box.findMany({
      where: boxWhereUserIsOwnerInput(user.id),
      select: defaultBoxSelect,
      orderBy: { updatedAt: 'desc' },
    });
    return boxes;
  }),
  fetchRecentlyViewed: t.procedure.query(async ({ ctx }) => {
    const user = getUserOrThrow(ctx);
    const views = await ctx.prisma.boxViews.findMany({
      where: boxWhereUserIsOwnerInput(user.id),
      select: { box: { select: defaultBoxSelect } },
      orderBy: { viewedAt: 'desc' },
      take: 5,
    });
    return views.map((view) => view.box);
  }),
});
