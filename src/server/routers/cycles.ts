import { getUserOrThrow } from '@lib/prisma';
import { CycleStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const cycleRouter = router({
  create: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = getUserOrThrow(ctx);

      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          isPublic: true,
          createdBy: { select: { id: true } },
        },
      });

      if (!project) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!project.isPublic && project.createdBy.id !== user.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      await ctx.prisma.cycle.create({
        data: {
          isPublic: project.isPublic,
          createdBy: { connect: { id: user.id } },
          project: { connect: { id: project.id } },
          startDate: new Date(),
        },
      });

      return true;
    }),
  reveal: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = getUserOrThrow(ctx);

      const cycle = await ctx.prisma.cycle.findFirst({
        where: {
          id: input.id,
        },
        select: { isPublic: true, status: true, createdBy: true },
      });

      if (!cycle) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!cycle.isPublic && cycle.createdBy.id !== user.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      if (cycle.status !== CycleStatus.PENDING)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'A cycle must be pending before it can be opened',
        });

      await ctx.prisma.cycle.update({
        where: { id: input.id },
        data: { status: CycleStatus.OPEN },
      });

      return true;
    }),
  close: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = getUserOrThrow(ctx);

      const cycle = await ctx.prisma.cycle.findFirst({
        where: {
          id: input.id,
        },
        select: { isPublic: true, status: true, createdBy: true },
      });

      if (!cycle) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!cycle.isPublic && cycle.createdBy.id !== user.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      if (cycle.status !== CycleStatus.OPEN)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'A cycle must be open before it can be closed',
        });

      await ctx.prisma.cycle.update({
        where: { id: input.id },
        data: { status: CycleStatus.CLOSED },
      });

      return true;
    }),
});
