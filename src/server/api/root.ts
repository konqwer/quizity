import { createTRPCRouter } from "~/server/api/trpc";
import { quizRouter } from "~/server/api/routers/quiz";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  quiz: quizRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
