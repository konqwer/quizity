import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import QuizItem from "~/components/Quizzes/QuizItem";
import LoadingScreen from "~/components/Screens/LoadingScreen";
import User404 from "~/components/Screens/User404";
import { api } from "~/utils/api";

const User = () => {
  const router = useRouter();
  const { data: user, isError } = api.user.getById.useQuery(
    router.query.userId as string,
    {
      retry: false,
    }
  );
  console.log(user);
  if (isError || user === null) return <User404 />;
  if (user === undefined) return <LoadingScreen />;

  return (
    <>
      <div className="mb-12 flex items-center gap-4">
        <Image
          className="h-24 w-24 rounded-full"
          width="128"
          height="128"
          alt="avatar"
          src={user.image || "/default-avatar.jpg"}
        />
        <h1 className="text-4xl font-bold md:text-5xl">{user.name}</h1>
      </div>
      <div className="flex flex-col items-center gap-4">
        {user.createdQuizzes.length ? (
          user.createdQuizzes.map((quiz) => (
            <QuizItem quiz={quiz} key={quiz.id} />
          ))
        ) : (
          <div className="mt-8 text-2xl font-bold">No quizzes created :(</div>
        )}
      </div>
    </>
  );
};

export default User;
