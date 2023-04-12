import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { asOwnFullQuiz, asPublicFullQuiz } from "~/types/prismaValidators";
import { zodQuiz, zodQuizResult } from "~/types/zodTypes";

export const quizRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    let isOwner = false;
    if (ctx.session) {
      const authorIdQuiz = await ctx.prisma.quiz.findUnique({
        where: { id: input },
        select: { authorId: true },
      });
      isOwner = ctx.session?.user.id === authorIdQuiz?.authorId;
    }
    const quiz = await ctx.prisma.quiz.findUniqueOrThrow({
      where: { id: input },
      select: isOwner ? asOwnFullQuiz : asPublicFullQuiz,
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
  create: protectedProcedure.input(zodQuiz).mutation(async ({ ctx, input }) => {
    const { title, description, questions } = input;
    const authorId = ctx.session.user.id;
    const quiz = await ctx.prisma.quiz.create({
      data: { title, description, authorId, questions },
    });
    return quiz;
  }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: zodQuiz,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUniqueOrThrow({
        where: { id: input.id },
        select: { authorId: true },
      });
      const isOwner = ctx.session?.user.id === quiz.authorId;
      if (!isOwner) throw new Error("You are not the author of this quiz");

      const { title, description, questions } = input.data;
      const updatedQuiz = await ctx.prisma.quiz.update({
        where: { id: input.id },
        data: { title, description, questions },
      });
      return updatedQuiz;
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUniqueOrThrow({
        where: { id: input },
        select: { authorId: true },
      });
      if (quiz.authorId !== ctx.session.user.id) {
        throw new Error("You are not the author of this quiz");
      }
      await ctx.prisma.view.deleteMany({ where: { quizId: input } });
      await ctx.prisma.quiz.delete({ where: { id: input } });
      return true;
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
  createResult: protectedProcedure
    .input(zodQuizResult)
    .mutation(async ({ ctx, input }) => {
      const { quizId, answers } = input;
      const userId = ctx.session.user.id;
      const quiz = await ctx.prisma.quiz.findUniqueOrThrow({
        where: { id: quizId },
        select: { questions: true },
      });
      // verify answers with questions we got from quiz
      const verifiedAnswers = answers.map((answer) => {
        const question = quiz.questions.find(
          (question) => question.question === answer.question
        );
        if (!question) throw new Error("Answers were modified");
        const options = answer.options.map((option) => {
          const isCorrect = question.options.find(
            (questionOption) =>
              questionOption.option === option.option &&
              questionOption.isCorrect === option.isPicked
          );
          return { ...option, isCorrect: !!isCorrect };
        });
        return { ...answer, options };
      });
      const result = await ctx.prisma.quizResult.create({
        data: { quizId, userId, answers: verifiedAnswers },
      });
      return result;
    }),
});
