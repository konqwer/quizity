import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import LoadingScreen from "~/components/Screens/LoadingScreen";
import NotFound from "~/components/Screens/NotFound";
import { api } from "~/utils/api";

const colors = [
  "bg-green-500",
  "bg-fuchsia-500",
  "bg-sky-500",
  "bg-yellow-500",
];

const Play = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [answers, setAnswers] = useState<
    { question: string; answer: string }[]
  >([]);

  const { data: quiz, isError } = api.quiz.getById.useQuery(
    router.query.quizId as string
  );
  const { mutateAsync: createResult } = api.result.create.useMutation();

  if (quiz === null || isError) return <NotFound name={"quiz"} />;
  if (sessionData === null) return void signIn();
  if (sessionData === undefined || quiz === undefined) return <LoadingScreen />;

  const answerHandler = (answer: string) => {
    if (answers.length + 1 === quiz.questions.length) {
      void createResult({
        quizId: quiz.id,
        answers: [
          ...answers,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          { question: quiz.questions[answers.length]!.question, answer },
        ],
      }).then((res) => router.push(`/result/${res.id}`));
    } else {
      setAnswers((prev) => [
        ...prev,
        {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          question: quiz.questions[answers.length]!.question,
          answer,
        },
      ]);
    }
  };

  return (
    <>
      <Head>
        <title>Quizity - {quiz.title}</title>
      </Head>
      <div className="mb-4 flex justify-between text-2xl font-bold">
        <button onClick={() => void router.back()}>
          <FaArrowLeft />
        </button>
        <h1>{quiz.title}</h1>
        <h1>
          {answers.length + 1}/{quiz.questions.length}
        </h1>
      </div>
      <div className="mx-auto flex h-[70vh] w-[min(600px,100%)] flex-col gap-2 rounded-md bg-gray-200 p-2">
        <div className="flex grow items-center justify-center rounded-md bg-gray-100 p-2 text-xl font-bold">
          {quiz.questions[answers.length]?.question}
        </div>
        <div
          className={`grid grow gap-2 ${
            quiz.questions[answers.length]?.options.length === 3
              ? "grid-cols-3"
              : "grid-cols-2"
          }`}
        >
          {quiz.questions[answers.length]?.options.map((option, optionIdx) => (
            <button
              key={option.option}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              className={`grow break-words rounded-md p-2 text-xl font-bold ${colors[
                optionIdx
              ]!}`}
              onClick={() => {
                answerHandler(option.option);
              }}
            >
              {option.option}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Play;
