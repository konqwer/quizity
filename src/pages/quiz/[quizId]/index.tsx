import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaBookmark, FaEye, FaPlay, FaThumbsUp } from "react-icons/fa";
import QuestionItem from "~/components/Quizzes/QuizPage/QuestionItem";
import LoadingScreen from "~/components/Screens/LoadingScreen";
import Loading from "~/components/UI/Loading";
import NotFound from "~/components/Screens/NotFound";
import { api } from "~/utils/api";
import Head from "next/head";

const Quiz = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const {
    data: quiz,
    isError,
    refetch: refetchQuiz,
  } = api.quiz.getById.useQuery(router.query.quizId as string, {
    retry: false,
  });
  const { data: user, refetch: refetchUser } = api.user.profile.useQuery();

  const { mutate: like, isLoading: likeIsLoading } = api.quiz.like.useMutation({
    onSuccess: () => {
      void refetchQuiz();
      void refetchUser();
    },
  });
  const { mutate: save, isLoading: saveIsLoading } = api.quiz.save.useMutation({
    onSuccess: () => {
      void refetchQuiz();
      void refetchUser();
    },
  });
  const { mutate: deletee, isLoading: deleteIsLoading } =
    api.quiz.delete.useMutation({
      onSuccess: () => router.push("/profile"),
    });

  if (quiz === null || isError) return <NotFound name={"quiz"} />;
  if (quiz === undefined || deleteIsLoading) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>Quizity - {quiz.title}</title>
      </Head>
      <div className="mb-12 flex flex-col items-start justify-between gap-12 md:flex-row">
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl font-bold md:text-5xl">{quiz.title}</h1>
          <p className="break-words text-2xl font-bold text-gray-700 md:text-2xl">
            {quiz.description}
          </p>
        </div>
        <div className="flex w-full flex-col gap-8 md:mt-2 md:items-end">
          <div className="flex items-center justify-between gap-4">
            {sessionData?.user.id === quiz.author.id ? (
              <div className="flex h-10 divide-x divide-gray-300 overflow-hidden rounded-full bg-gray-200 text-sm font-bold text-gray-600">
                <Link
                  href={`/quiz/${quiz.id}/results`}
                  className="flex items-center px-4 hover:bg-indigo-600 hover:text-white"
                >
                  Results
                </Link>
                <Link
                  href={`/quiz/${quiz.id}/edit`}
                  className="flex items-center px-4 hover:bg-indigo-600 hover:text-white"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deletee(quiz.id)}
                  className="px-4 hover:bg-red-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            ) : (
              <Link
                href={`/user/${quiz.author.id}`}
                className="flex items-center gap-2 transition-colors hover:text-indigo-600"
              >
                <span>by</span>
                <Image
                  width="64"
                  height="64"
                  src={quiz.author.image || "/default-avatar.jpg"}
                  alt="Author avatar"
                  className="h-10 w-10 rounded-full"
                />
                <span className="font-bold">{quiz.author.name}</span>
              </Link>
            )}
            <Link
              href={`/quiz/${quiz.id}/play`}
              className="flex h-10 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-bold text-white"
            >
              Play
            </Link>
          </div>
          <div className="flex justify-between gap-8 font-semibold text-gray-600 md:justify-end">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <FaPlay />
                <span>{quiz.resultsCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEye />
                <span>{quiz.viewsCount}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  sessionData ? likeIsLoading || like(quiz.id) : void signIn()
                }
                className={`flex items-center gap-2 hover:text-indigo-600 ${
                  user?.likedQuizzes.map((quiz) => quiz.id).includes(quiz.id)
                    ? "text-indigo-600 hover:text-red-600"
                    : "hover:text-indigo-600"
                }`}
              >
                {likeIsLoading ? <Loading /> : <FaThumbsUp />}
                <span>{quiz.likesCount}</span>
              </button>
              <button
                onClick={() =>
                  sessionData ? saveIsLoading || save(quiz.id) : void signIn()
                }
                className={`flex items-center gap-2 hover:text-indigo-600 ${
                  user?.savedQuizzes.map((quiz) => quiz.id).includes(quiz.id)
                    ? "text-yellow-600 hover:text-red-600"
                    : "hover:text-yellow-600"
                }`}
              >
                {saveIsLoading ? <Loading /> : <FaBookmark />}
                <span>{quiz.savesCount}</span>
              </button>
            </div>
          </div>
          <div className="font-semibold text-gray-600">
            {quiz.createdAt.toDateString()}
          </div>
        </div>
      </div>
      <h2 className="mb-8 text-2xl font-bold md:text-3xl">Questions:</h2>
      <div className="space-y-4">
        {quiz.questions.map((question, idx) => (
          <QuestionItem
            key={question.question + idx.toString()}
            question={question}
          />
        ))}
      </div>
    </>
  );
};

export default Quiz;
