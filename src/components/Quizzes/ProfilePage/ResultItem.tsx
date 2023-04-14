import { type Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { type FC } from "react";
import type { asOwnResult } from "~/types/prismaValidators";

const ResultItem: FC<{
  showUser?: boolean;
  result: Prisma.ResultGetPayload<{ select: typeof asOwnResult }>;
}> = ({ result, showUser }) => {
  const correctAnswers = React.useMemo(
    () =>
      result?.answers.filter((answer) =>
        answer.options.find((option) => option.isCorrect && option.isPicked)
      ),
    [result]
  );

  return (
    <div className="flex w-[min(100%,1000px)] items-center justify-between gap-4 rounded-md bg-gray-200 p-4">
      <Link
        href={`/result/${result.id}`}
        className="grow text-xl font-bold hover:underline"
      >
        {showUser ? (
          <div className="flex items-center gap-2">
            <Image
              width="64"
              height="64"
              src={result.user?.image || "/default-avatar.jpg"}
              alt="User avatar"
              className="h-10 w-10 rounded-full"
            ></Image>
            {result.user.name}
          </div>
        ) : (
          result.quiz.title
        )}
      </Link>
      <h1 className="font-bold">
        {correctAnswers.length}/{result.answers.length}
      </h1>
    </div>
  );
};

export default ResultItem;
