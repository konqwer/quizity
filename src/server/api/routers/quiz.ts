import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const quizRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const quiz = await ctx.prisma.quiz.findUnique({
      where: { id: input },
      select: {
        id: true,
        title: true,
        description: true,
        author: { select: { name: true, image: true, id: true } },
        comments: true,
        likedByIDs: true,
        savedByIDs: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        questions: {
          select: { question: true, options: { select: { option: true } } },
        },
      },
    });
    if (!quiz) return null;
    if (!ctx.session) return quiz;
    // If user seen this quiz in last hour, don't create a new view
    const lastView = await ctx.prisma.view.findFirst({
      where: {
        quizId: input,
        userId: ctx.session.user.id,
        createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60) },
      },
    });
    if (!lastView) {
      await ctx.prisma.view.create({
        data: { quizId: input, userId: ctx.session.user.id },
      });
    }
    return quiz;
  }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5, "Title must contain at least 5 characters"),
        description: z
          .string()
          .min(5, "Description must contain at least 5 characters"),
        questions: z
          .array(
            z.object({
              question: z.string().min(1, "Question title is missing"),
              options: z
                .array(
                  z.object({
                    option: z.string().min(1, "Option title is missing"),
                    isCorrect: z.boolean(),
                  })
                )
                .min(2, "Question must contain at least 2 options")
                .refine(
                  (options) => options.some((option) => option.isCorrect),
                  {
                    message: "At least one option must be correct",
                  }
                ),
            })
          )
          .min(3, "Quiz must contain at least 3 questions"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description, questions } = input;
      const authorId = ctx.session.user.id;
      const post = await ctx.prisma.quiz.create({
        data: { title, description, authorId, questions },
      });
      return post;
    }),
  like: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUniqueOrThrow({
        where: { id: input },
        select: { likedByIDs: true },
      });
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        select: { likedQuizzesIDs: true },
      });
      const likedByIDs = quiz.likedByIDs ?? [];
      const likedQuizzesIDs = user.likedQuizzesIDs ?? [];
      const userIndex = likedByIDs.indexOf(ctx.session.user.id);
      const quizIndex = likedQuizzesIDs.indexOf(input);
      if (userIndex === -1) {
        likedByIDs.push(ctx.session.user.id);
        likedQuizzesIDs.push(input);
      } else {
        likedByIDs.splice(userIndex, 1);
        likedQuizzesIDs.splice(quizIndex, 1);
      }
      await ctx.prisma.quiz.update({
        where: { id: input },
        data: { likedByIDs },
      });
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { likedQuizzesIDs },
      });
      return true;
    }),
  save: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUniqueOrThrow({
        where: { id: input },
        select: { savedByIDs: true },
      });
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        select: { savedQuizzesIDs: true },
      });
      const savedByIDs = quiz.savedByIDs ?? [];
      const savedQuizzesIDs = user.savedQuizzesIDs ?? [];
      const userIndex = savedByIDs.indexOf(ctx.session.user.id);
      const quizIndex = savedQuizzesIDs.indexOf(input);
      if (userIndex === -1) {
        savedByIDs.push(ctx.session.user.id);
        savedQuizzesIDs.push(input);
      } else {
        savedByIDs.splice(userIndex, 1);
        savedQuizzesIDs.splice(quizIndex, 1);
      }
      await ctx.prisma.quiz.update({
        where: { id: input },
        data: { savedByIDs },
      });
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { savedQuizzesIDs },
      });
      return true;
    }),
});
