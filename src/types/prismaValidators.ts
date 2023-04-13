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
export const asPublicView = Prisma.validator<Prisma.ViewSelect>()({
  createdAt: true,
});
export const asOwnView = Prisma.validator<Prisma.ViewSelect>()({
  ...asPublicView,
  quiz: {
    select: asPublicQuiz,
  },
});
export const asPublicResult = Prisma.validator<Prisma.ResultSelect>()({
  createdAt: true,
});
export const asOwnResult = Prisma.validator<Prisma.ResultSelect>()({
  id: true,
  answers: true,
  createdAt: true,
  user: { select: asPublicUser },
  quiz: { select: asPublicQuiz },
});

export const asPublicFullQuiz = Prisma.validator<Prisma.QuizSelect>()({
  ...asPublicQuiz,
  description: true,
  comments: true,
  likedByIDs: true,
  savedByIDs: true,
  views: { select: asPublicView },
  results: { select: asPublicResult },
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
  views: { select: asPublicView },
  results: { select: asOwnResult },
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

export const asPublicFullUser = Prisma.validator<Prisma.UserSelect>()({
  ...asPublicUser,
  createdQuizzes: {
    orderBy: { updatedAt: "desc" },
    select: asPublicQuiz,
  },
});
