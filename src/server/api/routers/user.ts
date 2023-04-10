import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
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
});
