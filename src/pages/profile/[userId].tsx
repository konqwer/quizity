import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import List from "~/components/Quizzes/QuizList/List";
import QuizCard from "~/components/Quizzes/QuizList/QuizCard";
import LoadingScreen from "~/components/Screens/LoadingScreen";
import NotFound from "~/components/Screens/NotFound";
import { api } from "~/utils/api";

const User = () => {
  const router = useRouter();
  const { data: user, isError } = api.user.getById.useQuery(
    router.query.userId as string,
    {
      retry: false,
    }
  );
  if (isError || user === null) return <NotFound name={"user"} />;
  if (user === undefined) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>Quizity - {user.name}</title>
      </Head>
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
      {user.createdQuizzes.length ? (
        <List>
          {user.createdQuizzes.map((quiz) => (
            <QuizCard quiz={quiz} key={quiz.id} />
          ))}
        </List>
      ) : (
        <h1 className="mt-16 text-center text-2xl font-bold">
          Nothing here :(
        </h1>
      )}
    </>
  );
};

export default User;
