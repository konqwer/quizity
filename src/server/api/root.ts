import { createTRPCRouter } from "~/server/api/trpc";
import { quizRouter } from "~/server/api/routers/quiz";
import { userRouter } from "./routers/user";
import { resultRouter } from "./routers/result";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  quiz: quizRouter,
  user: userRouter,
  result: resultRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
