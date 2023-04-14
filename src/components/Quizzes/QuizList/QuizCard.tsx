import type { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { type FC, useState } from "react";
import { FaEye, FaPlay } from "react-icons/fa";
import type { asDisplayQuiz } from "~/types/prismaValidators";

const QuizCard: FC<{
  quiz: Prisma.QuizGetPayload<{ select: typeof asDisplayQuiz }>;
}> = ({ quiz }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { data: sessionData } = useSession();
  const isOwner = sessionData?.user.id === quiz.author?.id;
  return (
    <div className="flex flex-col gap-4 rounded-md bg-gray-200 p-4 hover:bg-gray-300">
      <Link
        href={`/quiz/${quiz.id}`}
        className="hover: space-y-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h1
          className={`line-clamp-2 h-14 break-words text-xl font-bold ${
            isHovered ? "underline" : ""
          }`}
        >
          {quiz.title}
        </h1>
        <p className="line-clamp-2 h-12 overflow-hidden break-words">
          {quiz.description}
        </p>
        <p className="font-semibold">{quiz.questions.length} questions</p>
      </Link>
      <div className="flex justify-between gap-2">
        <Link
          href={`/profile/${isOwner ? "" : quiz.author.id}`}
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
          <span className={`font-bold ${isOwner ? "text-indigo-600" : ""}`}>
            {isOwner ? "You" : quiz.author?.name}
          </span>
        </Link>
        <div className="flex gap-4 font-semibold text-gray-600">
          <div className="flex items-center gap-2">
            <FaPlay />
            <span>{quiz.resultsCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEye />
            <span>{quiz.viewsCount}</span>
          </div>
        </div>
      </div>
      <Link
        href={`/quizy/${quiz.id}/play`}
        className="rounded-md bg-indigo-600 p-2 text-center font-bold text-white"
      >
        Play
      </Link>
    </div>
  );
};

export default QuizCard;
