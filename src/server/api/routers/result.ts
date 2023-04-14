import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { asOwnResult } from "~/types/prismaValidators";
import { zodQuizResult } from "~/types/zodTypes";

export const resultRouter = createTRPCRouter({
  create: protectedProcedure
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
        const answerr = question?.options.find(
          (option) => option.option === answer.answer
        );
        if (!question || !answerr) throw new Error("Answers were modified");
        return {
          ...question,
          options: question.options.map((option) => {
            return {
              ...option,
              isPicked: option.option === answer.answer,
            };
          }),
        };
      });
      const result = await ctx.prisma.result.create({
        data: { quizId, userId, answers: verifiedAnswers },
      });
      await ctx.prisma.quiz.update({
        where: { id: quizId },
        data: {
          resultsCount: { increment: 1 },
        },
      });
      return result;
    }),
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const result = await ctx.prisma.result.findUniqueOrThrow({
      where: { id: input },
      select: asOwnResult,
    });
    if (
      !ctx.session ||
      (result.user.id !== ctx.session.user.id &&
        result.quiz.author.id !== ctx.session.user.id)
    )
      throw new Error("Unauthorized");
    return result;
  }),
});
