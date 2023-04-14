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
  description: true,
  likesCount: true,
  savesCount: true,
  viewsCount: true,
  resultsCount: true,
  createdAt: true,
  updatedAt: true,
  questions: {
    select: { question: true, options: { select: { option: true } } },
  },
});

export const asOwnView = Prisma.validator<Prisma.ViewSelect>()({
  createdAt: true,
  quiz: {
    select: asPublicQuiz,
  },
});
export const asOwnResult = Prisma.validator<Prisma.ResultSelect>()({
  id: true,
  answers: true,
  createdAt: true,
  user: { select: asPublicUser },
  quiz: { select: asPublicQuiz },
});

export const asOwnQuiz = Prisma.validator<Prisma.QuizSelect>()({
  ...asPublicQuiz,
  results: { orderBy: { createdAt: "desc" }, select: asOwnResult },
  questions: true,
});

export const asPublicFullUser = Prisma.validator<Prisma.UserSelect>()({
  ...asPublicUser,
  createdAt: true,
  createdQuizzes: {
    orderBy: { updatedAt: "desc" },
    select: asPublicQuiz,
  },
});
export const asOwnFullUser = Prisma.validator<Prisma.UserSelect>()({
  ...asPublicFullUser,
  likedQuizzes: {
    select: asPublicQuiz,
  },
  views: {
    orderBy: { createdAt: "desc" },
    distinct: ["quizId"],
    select: asOwnView,
  },
  savedQuizzes: {
    select: asPublicQuiz,
  },
  results: {
    orderBy: { createdAt: "desc" },
    select: asOwnResult,
  },
});
