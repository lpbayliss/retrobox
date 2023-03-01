import { getUserOrThrow } from '@lib/prisma';
import { CycleStatus, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { loremIpsum } from 'lorem-ipsum';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

const defaultProjectSelect = Prisma.validator<Prisma.ProjectSelect>()({
  id: true,
  name: true,
  createdBy: { select: { id: true, name: true, email: true } },
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
        select: defaultProjectSelect,
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
        select: {
          ...defaultProjectSelect,
          ...{
            cycles: {
              select: {
                id: true,
                startDate: true,
                endDate: true,
                items: {
                  select: {
                    id: true,
                    content: true,
                    createdBy: true,
                    itemReaction: { select: { reactionType: true } },
                    createdAt: true,
                  },
                },
                status: true,
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      });

      if (user) {
        await ctx.prisma.projectViews.upsert({
          where: { userId_projectId: { projectId: input.id, userId: user.id } },
          create: { viewedAt: new Date(), projectId: input.id, userId: user.id },
          update: { viewedAt: new Date() },
        });
      }

      if (!project) throw new TRPCError({ code: 'NOT_FOUND' });

      if (!project.isPublic && project.createdBy.id !== user?.id)
        throw new TRPCError({ code: 'FORBIDDEN' });

      project.cycles = project.cycles.map((cycle) => {
        if (cycle.status === CycleStatus.PENDING) {
          cycle.items = cycle.items.map((item) => ({ ...item, content: loremIpsum({ count: 1 }) }));
        }

        return cycle;
      });

      const cyclesWithContributors = project.cycles.map((cycle) => {
        const contributors = cycle.items
          .map((item) => item.createdBy)
          .filter((user, index, self) =>
            !user ? false : self.findIndex((t) => (!t ? false : t.id === user.id)) === index,
          );

        return { ...cycle, contributors };
      });

      return { ...project, cycles: cyclesWithContributors };
    }),
  fetchRecentlyViewed: publicProcedure.query(async ({ ctx }) => {
    const user = getUserOrThrow(ctx);
    const views = await ctx.prisma.projectViews.findMany({
      where: boxWhereUserIsOwnerInput(user.id),
      select: {
        project: {
          select: {
            ...defaultProjectSelect,
            ...{
              cycles: {
                select: {
                  id: true,
                  startDate: true,
                  endDate: true,
                  items: {
                    select: {
                      id: true,
                      content: true,
                      createdBy: true,
                      itemReaction: { select: { reactionType: true } },
                      createdAt: true,
                    },
                  },
                  status: true,
                },
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      },
      orderBy: { viewedAt: 'desc' },
      take: 5,
    });
    return views.map((view) => view.project);
  }),
  fetchAll: publicProcedure.query(async ({ ctx }) => {
    const user = getUserOrThrow(ctx);
    const projects = await ctx.prisma.project.findMany({
      where: boxWhereUserIsOwnerInput(user.id),
      select: defaultProjectSelect,
      orderBy: { updatedAt: 'desc' },
    });
    return projects;
  }),
});
