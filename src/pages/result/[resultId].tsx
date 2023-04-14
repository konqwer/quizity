import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import QuestionItem from "~/components/Quizzes/QuizPage/QuestionItem";
import LoadingScreen from "~/components/Screens/LoadingScreen";
import NotFound from "~/components/Screens/NotFound";
import { api } from "~/utils/api";

const Result = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { data: result, isError } = api.result.getById.useQuery(
    router.query.resultId as string,
    {
      retry: false,
    }
  );

  const correctAnswers = useMemo(
    () =>
      result?.answers.filter((answer) =>
        answer.options.find((option) => option.isCorrect && option.isPicked)
      ),
    [result]
  );

  if (sessionData === null) return void signIn();
  if (result === null || isError) return <NotFound name={"result"} />;
  if (result === undefined || sessionData === undefined)
    return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>
          Quizity - {result.user.name}`s result of {result.quiz.title}
        </title>
      </Head>
      <div className="mb-12 flex flex-col items-start justify-between gap-12 md:flex-row">
        <div className="w-full md:w-2/3">
          <h1 className="mb-8 text-4xl font-bold md:text-5xl">
            <Link
              href={`/quiz/${result.quiz.id}`}
              className="mr-2 hover:underline"
            >
              {result.quiz.title}
            </Link>
            <span className="text-2xl font-bold text-gray-700 md:text-2xl">
              result
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-full overflow-hidden rounded-md bg-gray-200 ring-4 ring-gray-200">
              <div
                className={`h-full rounded-md bg-green-500`}
                style={{
                  width: `${Math.floor(
                    ((correctAnswers?.length || 0) / result.answers.length) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
            <h2 className="text-xl font-bold text-gray-600">
              {correctAnswers?.length}/{result.answers.length}
            </h2>
          </div>
        </div>
        <div className="flex w-full flex-col gap-8 md:mt-2 md:items-end">
          <Link
            href={`/profile/${
              sessionData.user.id === result.user.id ? "" : result.user.id
            }`}
            className="flex items-center gap-2 transition-colors hover:text-indigo-600"
          >
            <span>by</span>
            <Image
              width="64"
              height="64"
              src={result.user.image || "/default-avatar.jpg"}
              alt="Author avatar"
              className="h-10 w-10 rounded-full"
            />
            <span className="font-bold">
              {sessionData.user.id === result.user.id
                ? "You"
                : result.user.name}
            </span>
          </Link>
          <div className="font-semibold text-gray-600">
            {result.createdAt.toDateString()}
          </div>
        </div>
      </div>
      <h2 className="mb-8 text-2xl font-bold md:text-3xl">Answers:</h2>
      <div className="space-y-4">
        {result.answers.map((question, idx) => (
          <QuestionItem
            key={question.question + idx.toString()}
            question={question}
          />
        ))}
      </div>
    </>
  );
};

export default Result;
