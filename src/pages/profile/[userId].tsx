import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import QuizItem from "~/components/Quizzes/QuizItem";
import Loading from "~/components/UI/Loading";
import { api } from "~/utils/api";

const Quiz = () => {
  const router = useRouter();
  const { data: user, isError } = api.user.getById.useQuery(
    router.query.userId as string,
    {
      retry: false,
    }
  );
  if (isError) return router.back();
  if (user === null) return void router.replace("/profile");
  if (user === undefined)
    return <Loading className="mx-auto mt-[20vh] h-16 w-16 text-gray-400" />;

  return (
    <>
      <div className="mb-12 flex items-center gap-4">
        <Image
          className="h-24 w-24 rounded-full"
          width="128"
          height="128"
          alt="avatar"
          src={user.image}
        />
        <h1 className="text-4xl font-bold md:text-5xl">{user.name}</h1>
      </div>
      <div className="flex flex-col items-center gap-4">
        {user.createdQuizzes.length ? (
          user.createdQuizzes.map((quiz) => (
            <QuizItem quiz={{ ...quiz, author: user }} key={quiz.id} />
          ))
        ) : (
          <div className="mt-8 text-2xl font-bold">No quizzes created :(</div>
        )}
      </div>
    </>
  );
};

export default Quiz;
