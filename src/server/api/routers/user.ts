import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  profile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      include: {
        createdQuizzes: { include: { author: true } },
        likedQuizzes: { include: { author: true } },
        views: { include: { quiz: { include: { author: true } } } },
        savedQuizzes: { include: { author: true } },
      },
    });
    return user;
  }),
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    // if (ctx.session && ctx.session.user.id === input) return null;
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: input },
      include: {
        createdQuizzes: true,
      },
    });
    return user;
  }),
});
