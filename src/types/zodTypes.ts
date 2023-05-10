import { z } from "zod";

export const zodQuiz = z.object({
  title: z.string().min(1, "Title is requirred"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters"),
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
          .refine((options) => options.some((option) => option.isCorrect), {
            message: "At least one option must be correct",
          })
          .refine(
            (options) =>
              !options.some((option1, idx1) =>
                options.some(
                  (option2, idx2) =>
                    idx1 !== idx2 &&
                    option1.option === option2.option &&
                    option1.option.length
                )
              ),
            {
              message: "Equal options should not exist",
            }
          ),
      })
    )
    .min(3, "Quiz must contain at least 3 questions"),
});

export const zodQuizResult = z.object({
  quizId: z.string(),
  answers: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});
