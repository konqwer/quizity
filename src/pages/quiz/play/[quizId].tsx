import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import LoadingScreen from "~/components/Screens/LoadingScreen";
import Quiz404 from "~/components/Screens/Quiz404";
import { api } from "~/utils/api";

const Play = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  // answered question reducer
  const [answeredQuestions, setAnsweredQuestions] = useState();
  const { data: quiz, isError } = api.quiz.getById.useQuery(
    router.query.quizId as string
  );
  const { mutateAsync: create } = api.quiz.createResult.useMutation();

  if (quiz === null || isError) return <Quiz404 />;
  if (sessionData === null) return void signIn();
  if (sessionData === undefined || sessionData === null || quiz)
    return <LoadingScreen />;

  return <div />;
};

export default Play;
