import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { asOwnFullUser, asPublicFullUser } from "~/types/prismaValidators";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select: asOwnFullUser,
    });
    return user;
  }),
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: input },
      select: asPublicFullUser,
    });
    return user;
  }),
});
