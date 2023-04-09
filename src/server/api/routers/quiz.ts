import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const quizRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getSecretMessage: protectedProcedure.query(({ ctx }) => {
    // console.log("ctx", ctx);
    return ctx.session;
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
});
