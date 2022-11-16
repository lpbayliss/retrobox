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
  isPublic: true,
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
        isPublic: z.boolean().optional().default(false),
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

      const box = await ctx.prisma.box.findUnique({
        where: { id: input.id },
        select: {
          isPublic: true,
          items: { where: { drop: { is: null } } },
          createdBy: { select: { id: true } },
        },
      });

      if (!box) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!box.isPublic && box.createdBy.id !== user.id) throw new TRPCError({ code: 'FORBIDDEN' });

      await ctx.prisma.drop.create({
        data: {
          box: { connect: { id: input.id } },
          isPublic: box.isPublic,
          createdBy: { connect: { id: user.id } },
          items: { connect: box.items.map((item) => ({ id: item.id })) },
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
      const user = ctx.session?.user;

      await ctx.prisma.item.create({
        data: {
          content: input.content,
          boxId: input.id,
          userId: input.anonymous ? undefined : user?.id,
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
      const user = ctx.session?.user;

      const box = await ctx.prisma.box.findUnique({
        where: { id: input.id },
        select: defaultBoxSelect,
      });

      if (!box) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!box.isPublic && box.createdBy.id !== user?.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      if (user) {
        await ctx.prisma.boxViews.upsert({
          where: { userId_boxId: { boxId: input.id, userId: user.id } },
          create: { viewedAt: new Date(), boxId: input.id, userId: user.id },
          update: { viewedAt: new Date() },
        });
      }

      return box;
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
  fetchContributors: t.procedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      getUserOrThrow(ctx);
      const box = await ctx.prisma.box.findUnique({
        where: { id: input.id },
        select: { items: { select: { createdBy: { select: { name: true, id: true } } } } },
      });
      if (!box) throw new TRPCError({ code: 'NOT_FOUND' });
      return box.items
        .map((item) => item.createdBy)
        .filter((user, index, self) =>
          !user ? false : self.findIndex((t) => (!t ? false : t.id === user.id)) === index,
        );
    }),
});
