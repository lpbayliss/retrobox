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
        select: {
          isPublic: true,
          status: true,
          createdBy: true,
          items: { select: { content: true } },
        },
      });

      if (!cycle) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!cycle.isPublic && cycle.createdBy.id !== user.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      if (cycle.status !== CycleStatus.OPEN)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'A cycle must be open before it can be closed',
        });

      const itemsAsPoints = cycle.items.map((item, index) => `${index + 1}. ${item.content}`);

      const prompt =
        'Given the following items, provide a summary from a first-person plural perspective without referencing the "theme" or "items": ' +
        itemsAsPoints.reduce((acc, curr, index) => {
          if (index === 0) {
            return acc + curr;
          }
          return acc + '\n' + curr;
        }, '');

      const response = await ctx.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: prompt,
        temperature: 0,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const openaiResponse = response.data.choices[0].text || 'This cycle could not be summarized';

      await ctx.prisma.cycle.update({
        where: { id: input.id },
        data: {
          status: CycleStatus.CLOSED,
          endDate: new Date(),
          summary: openaiResponse.replace(/\n/g, ''),
        },
      });

      return true;
    }),
  addItem: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        isAnonymous: z.boolean(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;

      const cycle = await ctx.prisma.cycle.findFirst({
        where: {
          id: input.id,
        },
        select: { isPublic: true, status: true, createdBy: true },
      });

      if (!cycle) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!cycle.isPublic && cycle.createdBy.id !== user?.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      if (cycle.status === CycleStatus.CLOSED)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot add items to a closed cycle' });

      const item = await ctx.prisma.item.create({
        data: {
          content: input.content,
          ...(!input.isAnonymous && !!user && { createdBy: { connect: { id: user.id } } }),
          cycle: { connect: { id: input.id } },
          // sentiment: sentiment,
        },
        select: {
          id: true,
          content: true,
        },
      });

      ctx.bullmq.itemGPTSentiment.add(`item-${item.id}`, item);

      return true;
    }),
  fetchItems: publicProcedure
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
          createdBy: { select: { id: true } },
          isPublic: true,
          items: {
            select: {
              id: true,
              content: true,
              createdBy: true,
              itemReaction: { select: { reactionType: true } },
              createdAt: true,
              sentiment: true,
            },
          },
        },
      });

      if (!cycle) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!cycle.isPublic && cycle.createdBy.id !== user?.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      if (!cycle.items) throw new TRPCError({ code: 'NOT_FOUND' });

      return cycle.items;
    }),
  fetchContributors: publicProcedure
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
          createdBy: { select: { id: true } },
          isPublic: true,
          items: {
            select: {
              id: true,
              content: true,
              createdBy: true,
              itemReaction: { select: { reactionType: true } },
              createdAt: true,
            },
          },
        },
      });

      if (!cycle) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!cycle.isPublic && cycle.createdBy.id !== user?.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      const contributors = cycle.items
        .map((item) => item.createdBy)
        .filter((user, index, self) =>
          !user ? false : self.findIndex((t) => (!t ? false : t.id === user.id)) === index,
        );

      const hasAnonymous = !!cycle.items.find((item) => !item.createdBy);

      return hasAnonymous ? [...contributors, null] : contributors;
    }),
});
