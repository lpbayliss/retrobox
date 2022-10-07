import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { Context } from '../context';
import { t } from '../trpc';

const defaultItemSelect = Prisma.validator<Prisma.ItemSelect>()({
  id: true,
  createdBy: { select: { id: true, name: true } },
});

const defaultBoxSelect = Prisma.validator<Prisma.BoxSelect>()({
  id: true,
  name: true,
  team: true,
  createdBy: { select: { id: true, name: true, email: true } },
  items: { select: defaultItemSelect, where: { drop: { is: null } } },
  drops: { select: { id: true, createdAt: true, items: true }, orderBy: { createdAt: 'desc' } },
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
  createDrop: t.procedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = getUserOrThrow(ctx);

      const items = await ctx.prisma.item.findMany({
        where: { boxId: input.id, drop: { is: null } },
        select: { id: true },
      });

      await ctx.prisma.drop.create({
        data: {
          boxId: input.id,
          userId: user.id,
          items: { connect: items.map((item) => ({ id: item.id })) },
        },
      });

      return true;
    }),
  addItem: t.procedure
    .input(
      z.object({
        id: z.string().cuid(),
        content: z.string().min(5),
        anonymous: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = getUserOrThrow(ctx);
      await ctx.prisma.item.create({
        data: {
          content: input.content,
          boxId: input.id,
          userId: input.anonymous ? undefined : user.id,
        },
      });
      return true;
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
