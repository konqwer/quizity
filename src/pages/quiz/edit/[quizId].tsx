import { type Question } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import CreateForm from "~/components/Quizzes/CreateForm";
import Loading from "~/components/UI/Loading";
import { api } from "~/utils/api";

const Create = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { data: quiz, isError } = api.quiz.getById.useQuery(
    router.query.quizId as string,
    {
      retry: false,
    }
  );
  const { mutateAsync: edit } = api.quiz.edit.useMutation();

  if (quiz === null || isError || quiz?.author.id !== sessionData?.user.id)
    return router.back();
  if (sessionData === null) return void signIn();
  if (sessionData === undefined || quiz === undefined)
    return <Loading className="mx-auto mt-[20vh] h-16 w-16 text-gray-400" />;

  return (
    <CreateForm
      fillWith={{
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions as Question[],
      }}
      onSubmit={async (data) => {
        const res = await edit({ id: router.query.quizId as string, data });
        void router.push(`/quiz/${res.id}`);
      }}
    />
  );
};

export default Create;
