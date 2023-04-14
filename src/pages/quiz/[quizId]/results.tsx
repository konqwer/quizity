import type { Prisma } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import ResultItem from "~/components/Quizzes/QuizPage/ResultItem";
import LoadingScreen from "~/components/Screens/LoadingScreen";
import NotFound from "~/components/Screens/NotFound";
import type { asOwnResult } from "~/types/prismaValidators";
import { api } from "~/utils/api";

const Results = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { data: quiz, isError } = api.quiz.getById.useQuery(
    router.query.quizId as string,
    {
      retry: false,
    }
  );
  if (quiz === null || isError || quiz?.author.id !== sessionData?.user.id)
    return <NotFound name={"quiz"} />;
  if (sessionData === null) return void signIn();
  if (sessionData === undefined || quiz === undefined) return <LoadingScreen />;
  return (
    <>
      <Head>
        <title>Quizity - {quiz.title}</title>
      </Head>
      <h1 className="mb-12 text-4xl font-bold md:text-5xl">
        <Link href={`/quiz/${quiz.id}`} className="mr-2 hover:underline">
          {quiz.title}
        </Link>
        <span className="text-2xl font-bold text-gray-700 md:text-2xl">
          results
        </span>
      </h1>
      <div className="flex flex-col items-center gap-4">
        {(
          quiz as unknown as {
            results: Prisma.ResultGetPayload<{ select: typeof asOwnResult }>[];
          }
        ).results.map((result) => (
          <ResultItem key={result.id} showUser={true} result={result} />
        ))}
      </div>
    </>
  );
};

export default Results;
