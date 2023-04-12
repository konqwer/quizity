import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { type FC } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { api } from "~/utils/api";
import Loading from "../UI/Loading";
import { type asPublicQuiz } from "~/types/prismaValidators";

const OwnerTools: FC<{ onRefetch: () => void; quizId: string }> = ({
  onRefetch,
  quizId,
}) => {
  const { mutate: deleteQuiz, isLoading: deleteQuizIsLoading } =
    api.quiz.delete.useMutation({
      onSuccess: () => onRefetch(),
    });
  return (
    <>
      <Link
        href={`/quiz/edit/${quizId}`}
        className="flex h-10 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-bold text-white hover:bg-indigo-500"
      >
        Edit
      </Link>
      <button
        onClick={() => deleteQuiz(quizId)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500"
      >
        {deleteQuizIsLoading ? <Loading /> : <FaTrashAlt />}
      </button>
    </>
  );
};

const QuizItem: FC<{
  quiz: Prisma.QuizGetPayload<{ select: typeof asPublicQuiz }>;
  onRefetch?: () => void;
}> = ({ quiz, onRefetch }) => {
  const { data: sessionData } = useSession();

  return (
    <div
      key={quiz.id}
      className="flex w-[min(100%,1000px)] items-center justify-between gap-4 rounded-md bg-gray-200 p-4"
    >
      <Link
        href={`/quiz/${quiz.id}`}
        className="grow text-xl font-bold hover:underline"
      >
        {quiz.title}
      </Link>
      {quiz.author.id === sessionData?.user.id && onRefetch ? (
        <OwnerTools onRefetch={onRefetch} quizId={quiz.id} />
      ) : (
        <Link
          href={`/profile/${quiz.author.id}`}
          className="flex items-center gap-2 transition-colors hover:text-indigo-600"
        >
          <span>by</span>
          <Image
            width="64"
            height="64"
            src={quiz.author?.image || "/default-avatar.jpg"}
            alt="Author avatar"
            className="h-10 w-10 rounded-full"
          />
          <span className="font-bold">{quiz.author?.name}</span>
        </Link>
      )}
    </div>
  );
};

export default QuizItem;
