import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import CreateForm from "~/components/Quizzes/CreateForm";
import LoadingScreen from "~/components/Screens/LoadingScreen";
import { api } from "~/utils/api";

const Create = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { mutateAsync: create } = api.quiz.create.useMutation();

  if (sessionData === null) return void signIn();
  if (sessionData === undefined) return <LoadingScreen />;

  return (
    <CreateForm
      onSubmit={async (data) => {
        const res = await create(data);
        void router.push(`/quiz/${res.id}`);
      }}
    />
  );
};

export default Create;
