import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { Context } from '../context';
import { publicProcedure, router } from '../trpc';

const defaultBoxSelect = Prisma.validator<Prisma.ProjectSelect>()({
  id: true,
  name: true,
  createdBy: { select: { id: true, name: true, email: true } },
  cycle: { select: { id: true, createdAt: true, items: true }, orderBy: { createdAt: 'desc' } },
  isPublic: true,
});

const boxWhereUserIsOwnerInput = (userId: string) =>
  Prisma.validator<Prisma.ProjectWhereInput>()({
    userId,
  });

const getUserOrThrow = (ctx: Context) => {
  const user = ctx.session?.user;
  if (!user) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return user;
};

export const projectRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        teamId: z.string().cuid().optional(),
        isPublic: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = getUserOrThrow(ctx);
      const project = await ctx.prisma.project.create({
        data: {
          ...input,
          userId: user.id,
        },
        select: defaultBoxSelect,
      });
      return project;
    }),
  // createDrop: publicProcedure
  //   .input(
  //     z.object({
  //       id: z.string().cuid(),
  //     }),
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const user = getUserOrThrow(ctx);

  //     const project = await ctx.prisma.project.findUnique({
  //       where: { id: input.id },
  //       select: {
  //         isPublic: true,
  //         items: { where: { drop: { is: null } } },
  //         createdBy: { select: { id: true } },
  //       },
  //     });

  //     if (!project) throw new TRPCError({ code: 'NOT_FOUND' });

  //     if (!project.isPublic && project.createdBy.id !== user.id)
  //       throw new TRPCError({ code: 'FORBIDDEN' });

  //     await ctx.prisma.cycle.create({
  //       data: {
  //         project: { connect: { id: input.id } },
  //         isPublic: project.isPublic,
  //         createdBy: { connect: { id: user.id } },
  //         items: { connect: project.items.map((item) => ({ id: item.id })) },
  //       },
  //     });

  //     return true;
  //   }),
  addItem: publicProcedure
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
          userId: input.anonymous ? undefined : user?.id,
        },
      });

      return true;
    }),
  fetchById: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.session?.user;

      const box = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        select: defaultBoxSelect,
      });

      if (!box) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!box.isPublic && box.createdBy.id !== user?.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      return box;
    }),
  fetchAll: publicProcedure.query(async ({ ctx }) => {
    const user = getUserOrThrow(ctx);
    const boxes = await ctx.prisma.project.findMany({
      where: boxWhereUserIsOwnerInput(user.id),
      select: defaultBoxSelect,
      orderBy: { updatedAt: 'desc' },
    });
    return boxes;
  }),
  // fetchContributors: publicProcedure
  //   .input(
  //     z.object({
  //       id: z.string().cuid(),
  //     }),
  //   )
  //   .query(async ({ input, ctx }) => {
  //     getUserOrThrow(ctx);
  //     const project = await ctx.prisma.project.findUnique({
  //       where: { id: input.id },
  //       select: { items: { select: { createdBy: { select: { name: true, id: true } } } } },
  //     });
  //     if (!project) throw new TRPCError({ code: 'NOT_FOUND' });
  //     return project.items
  //       .map((item) => item.createdBy)
  //       .filter((user, index, self) =>
  //         !user ? false : self.findIndex((t) => (!t ? false : t.id === user.id)) === index,
  //       );
  //   }),
});
