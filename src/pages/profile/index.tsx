import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Tab } from "@headlessui/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import QuizItem from "~/components/Quizzes/QuizItem";
import Loading from "~/components/UI/Loading";
import { api } from "~/utils/api";

const tabs = ["Created", "Saved", "Liked", "History"];

const Profile = () => {
  const { data: sessionData } = useSession();
  const { data: user, isError, refetch } = api.user.profile.useQuery();
  const [parent] = useAutoAnimate();
  if (sessionData === null || user === null || isError) return void signIn();
  if (sessionData === undefined || user === undefined)
    return <Loading className="mx-auto mt-[20vh] h-16 w-16 text-gray-400" />;

  return (
    <>
      <div className="mb-12 flex items-center gap-4">
        <Image
          className="h-24 w-24 rounded-full"
          width="128"
          height="128"
          alt="avatar"
          src={user?.image || "/default-avatar.jpg"}
        />
        <h1 className="text-4xl font-bold md:text-5xl">{user.name}</h1>
      </div>
      <Tab.Group>
        <Tab.List className="mb-8 flex justify-between">
          {tabs.map((tab) => (
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
            user.likedQuizzes,
            user.views.map((view) => view.quiz),
          ].map((quizzes, idx) => (
            <Tab.Panel key={idx} className="flex flex-col items-center gap-4">
              {quizzes.length ? (
                quizzes.map((quiz) => (
                  <QuizItem
                    quiz={quiz}
                    key={quiz.id}
                    onRefetch={() => void refetch()}
                  />
                ))
              ) : (
                <div className="mt-8 text-2xl font-bold">Nothing here :(</div>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default Profile;
