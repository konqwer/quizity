import { Tab } from "@headlessui/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";

const tabs = ["Created", "Saved", "Liked", "History"];

const Profile = () => {
  const { data: sessionData } = useSession();
  const { data: user, isError } = api.user.me.useQuery();
  if (sessionData === null || user === null || isError) return signIn();
  if (sessionData === undefined || user === undefined) return <div />;
  return (
    <>
      <div className="mb-12 flex items-center gap-4">
        <Image
          className="h-24 w-24 rounded-full"
          width="128"
          height="128"
          alt="avatar"
          src={user?.image}
        />
        <h1 className="text-4xl font-bold md:text-5xl">{user.name}</h1>
      </div>
      <Tab.Group>
        <Tab.List className="mb-8 flex justify-between">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full border-b-4 p-1 text-center font-semibold transition-colors  ${
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
        <Tab.Panels>
          {[
            user.createdQuizzes,
            user.savedQuizzes,
            user.likedQuizzes,
            user.views.map((view) => view.quiz),
          ].map((quizzes, idx) => (
            <Tab.Panel key={idx} className="flex flex-col items-center gap-4">
              {quizzes.length ? (
                quizzes.map((quiz) => (
                  <Link
                    href={`/quiz/${quiz.id}`}
                    key={quiz.id}
                    className="flex w-[min(100%,1000px)] items-center justify-between gap-4 rounded-md bg-gray-200 p-4"
                  >
                    <h1 className="text-xl font-bold">{quiz.title}</h1>
                    {user.id === quiz.author.id ? (
                      <button className="h-10 rounded-full bg-indigo-600 px-6 text-sm font-bold text-white">
                        Edit
                      </button>
                    ) : (
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 transition-colors hover:text-indigo-600"
                      >
                        <span>by</span>
                        <Image
                          width="64"
                          height="64"
                          src={quiz.author.image}
                          alt="Author avatar"
                          className="h-10 w-10 rounded-full"
                        />
                        <span className="font-bold">{quiz.author.name}</span>
                      </Link>
                    )}
                  </Link>
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
