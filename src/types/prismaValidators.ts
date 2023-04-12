import { Prisma } from "@prisma/client";

export const asPublicUser = Prisma.validator<Prisma.UserSelect>()({
  name: true,
  image: true,
  id: true,
});

export const asPublicQuiz = Prisma.validator<Prisma.QuizSelect>()({
  id: true,
  author: { select: asPublicUser },
  title: true,
});

export const asPublicFullQuiz = Prisma.validator<Prisma.QuizSelect>()({
  ...asPublicQuiz,
  description: true,
  comments: true,
  likedByIDs: true,
  savedByIDs: true,
  views: { select: { createdAt: true } },
  createdAt: true,
  updatedAt: true,
  questions: {
    select: { question: true, options: { select: { option: true } } },
  },
});

export const asOwnFullQuiz = Prisma.validator<Prisma.QuizSelect>()({
  id: true,
  author: { select: asPublicUser },
  title: true,
  description: true,
  comments: true,
  likedByIDs: true,
  savedByIDs: true,
  views: { select: { createdAt: true } },
  createdAt: true,
  updatedAt: true,
  questions: true,
});

export const asOwnFullUser = Prisma.validator<Prisma.UserSelect>()({
  ...asPublicUser,
  createdQuizzes: {
    orderBy: { updatedAt: "desc" },
    select: asPublicQuiz,
  },
  likedQuizzes: {
    select: asPublicQuiz,
  },
  views: {
    orderBy: { createdAt: "desc" },
    distinct: ["quizId"],
    select: {
      quiz: {
        select: asPublicQuiz,
      },
    },
  },
  savedQuizzes: {
    select: asPublicQuiz,
  },
});

export const asPublicFullUser = Prisma.validator<Prisma.UserSelect>()({
  ...asPublicUser,
  createdQuizzes: {
    orderBy: { updatedAt: "desc" },
    select: asPublicQuiz,
  },
});
