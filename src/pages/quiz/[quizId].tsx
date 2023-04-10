import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { type FC } from "react";
import { FaBookmark, FaEye, FaThumbsUp } from "react-icons/fa";
import { api } from "~/utils/api";

const QuestionItem: FC<{
  question: { question: string; options: { option: string }[] };
}> = ({ question }) => {
  return (
    <div className="divide-y divide-gray-300 rounded-md bg-gray-200 p-4">
      <h1 className="text-xl font-bold">{question.question}</h1>
      <div className="grid grid-rows-2 gap-2 p-2">
        {question.options.map((option, idx) => (
          <div key={option.option + idx.toString()} className="">
            <h2>
              <span className="text-sm font-bold">
                {["A", "B", "C", "D"][idx]}.{" "}
              </span>
              <span className="text-xl font-semibold text-gray-600">
                {option.option}
              </span>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};
const Quiz = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const {
    data: quiz,
    isError,
    refetch,
  } = api.quiz.getById.useQuery(router.query.quizId as string, {
    retry: false,
  });
  const { mutate: like } = api.quiz.like.useMutation({
    onSuccess: () => refetch(),
  });
  const { mutate: save } = api.quiz.save.useMutation({
    onSuccess: () => refetch(),
  });
  if (quiz === null || isError) return router.back();
  if (quiz === undefined) return <div />;

  return (
    <>
      <div className="mb-12 flex flex-col items-start justify-between gap-12 md:flex-row">
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl font-bold md:text-5xl">{quiz.title}</h1>
          <p className="break-words text-2xl font-bold text-gray-700 md:text-2xl">
            {quiz.description}
          </p>
        </div>
        <div className="flex w-full flex-col gap-8 md:mt-2 md:items-end">
          {sessionData?.user.id === quiz.author.id ? (
            <button className="h-10 rounded-full bg-indigo-600 px-6 text-sm font-bold text-white">
              Edit
            </button>
          ) : (
            <Link
              href="/profile"
              className="flex items-center gap-2 transition-colors hover:text-indigo-600"
            >
              <h1>by</h1>
              <Image
                width="64"
                height="64"
                src={quiz.author.image}
                alt="Author avatar"
                className="h-10 w-10 rounded-full"
              />
              <h1 className="font-bold">{quiz.author.name}</h1>
            </Link>
          )}
          <div className="flex justify-between gap-8 font-semibold text-gray-600 md:justify-end">
            <div className="flex items-center gap-2">
              <FaEye />
              <span>{quiz.views.length}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => (sessionData ? like(quiz.id) : void signIn())}
                className={`flex items-center gap-2 hover:text-indigo-600 ${
                  quiz.likedByIDs.includes(sessionData?.user.id || "")
                    ? "text-indigo-600 hover:text-red-600"
                    : "hover:text-indigo-600"
                }`}
              >
                <FaThumbsUp />
                <span>{quiz.likedByIDs.length}</span>
              </button>
              <button
                onClick={() => (sessionData ? save(quiz.id) : void signIn())}
                className={`flex items-center gap-2 hover:text-indigo-600 ${
                  quiz.savedByIDs.includes(sessionData?.user.id || "")
                    ? "text-yellow-600 hover:text-red-600"
                    : "hover:text-yellow-600"
                }`}
              >
                <FaBookmark />
                <span>{quiz.savedByIDs.length}</span>
              </button>
            </div>
          </div>
          <div className="font-semibold text-gray-600">
            {quiz.createdAt.toDateString()}
          </div>
        </div>
      </div>
      <h2 className="mb-8 text-2xl font-bold md:text-3xl">Questions:</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {quiz.questions.map((question, idx) => (
          <QuestionItem key={quiz.title + idx.toString()} question={question} />
        ))}
      </div>
    </>
  );
};

export default Quiz;
