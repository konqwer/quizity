import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Tab } from "@headlessui/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import ResultItem from "~/components/Quizzes/QuizPage/ResultItem";
import List from "~/components/Quizzes/QuizList/List";
import QuizCard from "~/components/Quizzes/QuizList/QuizCard";
import LoadingScreen from "~/components/Screens/LoadingScreen";
import { api } from "~/utils/api";
import Head from "next/head";

const Profile = () => {
  const { data: sessionData } = useSession();
  const { data: user, isError } = api.user.me.useQuery();

  const [parent] = useAutoAnimate();
  if (sessionData === null || user === null || isError) return void signIn();
  if (sessionData === undefined || user === undefined) return <LoadingScreen />;

  console.log(user);
  return (
    <>
      <Head>
        <title>Quizity - Profile</title>
      </Head>
      <div className="mb-12 flex items-center gap-4">
        <Image
          className="h-24 w-24 rounded-full"
          width="128"
          height="128"
          alt="avatar"
          src={user?.image || "/default-avatar.jpg"}
        />
        <div>
          <h1 className="mb-1 text-4xl font-bold md:text-5xl">{user.name}</h1>
          <h2 className="font-semibold text-gray-600">
            {user.createdAt.toDateString()}
          </h2>
        </div>
      </div>
      <Tab.Group>
        <Tab.List className="mb-8 flex justify-between">
          {["Created", "Saved", "History", "Played"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full border-b-4 p-1 text-center font-semibold transition-colors focus:outline-none  ${
                  selected
                    ? "border-indigo-600"
                    : "text-gray-600 hover:border-gray-300 hover:text-gray-700"
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels ref={parent}>
          {[
            user.createdQuizzes,
            user.savedQuizzes,
            user.views.map((view) => view.quiz),
          ].map((quizzes, idx) => (
            <Tab.Panel key={idx}>
              {quizzes.length ? (
                <List>
                  {quizzes.map((quiz) => (
                    <QuizCard quiz={quiz} key={quiz.id} />
                  ))}
                </List>
              ) : (
                <h1 className="mt-16 text-center text-2xl font-bold">
                  Nothing here :(
                </h1>
              )}
            </Tab.Panel>
          ))}
          <Tab.Panel className="flex flex-col items-center gap-4">
            {user.results.length ? (
              user.results.map((result) => (
                <ResultItem key={result.id} result={result} />
              ))
            ) : (
              <h1 className="mt-16 text-center text-2xl font-bold">
                Nothing here :(
              </h1>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default Profile;
