import { getUserOrThrow } from '@lib/prisma';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

const defaultBoxSelect = Prisma.validator<Prisma.ProjectSelect>()({
  id: true,
  name: true,
  createdBy: { select: { id: true, name: true, email: true } },
  cycles: {
    select: { id: true, startDate: true, endDate: true, items: true, status: true },
    orderBy: { createdAt: 'desc' },
  },
  isPublic: true,
});

const boxWhereUserIsOwnerInput = (userId: string) =>
  Prisma.validator<Prisma.ProjectWhereInput>()({
    userId,
  });

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
  fetchById: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.session?.user;

      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        select: defaultBoxSelect,
      });

      if (!project) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!project.isPublic && project.createdBy.id !== user?.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      return project;
    }),
  fetchAll: publicProcedure.query(async ({ ctx }) => {
    const user = getUserOrThrow(ctx);
    const projects = await ctx.prisma.project.findMany({
      where: boxWhereUserIsOwnerInput(user.id),
      select: defaultBoxSelect,
      orderBy: { updatedAt: 'desc' },
    });
    return projects;
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
