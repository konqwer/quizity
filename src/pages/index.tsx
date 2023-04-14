import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import List from "~/components/Quizzes/QuizList/List";
import QuizCard from "~/components/Quizzes/QuizList/QuizCard";
import Loading from "~/components/UI/Loading";
import { api } from "~/utils/api";
import LoadingScreen from "~/components/Screens/LoadingScreen";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import Head from "next/head";

const Hero = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 text-2xl font-bold text-white md:grid-cols-2 md:text-5xl">
      <div className="row-start-1 row-end-3 rounded-md bg-sky-500 p-8">
        <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-white before:transition-transform hover:before:skew-y-3">
          <span className="relative text-sky-500">Quizity</span>
        </span>{" "}
        - platform for users to create, join, and learn from quizzes
      </div>
      <Link
        href="/quiz/create"
        className="flex items-center justify-center gap-4 rounded-md bg-green-500 p-8 transition-transform hover:scale-105"
      >
        Create quiz
      </Link>
      <a
        target="_blank"
        href="https://github.com/konqwer/quizity"
        className="flex items-center justify-center gap-4 rounded-md bg-fuchsia-500 p-8 transition-transform hover:-skew-x-1 hover:-skew-y-1"
      >
        Github page
        <FaGithub />
      </a>
    </div>
  );
};
const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: userData } = api.user.profile.useQuery(undefined, {
    enabled: !!sessionData,
  });
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.quiz.getMostPopular.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  if (data === undefined) return <LoadingScreen />;

  return (
    <div className="space-y-20">
      <Head>
        <title>Quizity - Home</title>
      </Head>
      <Hero />
      {sessionData && (
        <section>
          <h1 className="mb-8 text-4xl font-bold">Your recent</h1>
          {userData ? (
            userData.views.length ? (
              <List>
                {userData.views.slice(0, 4).map((view) => (
                  <QuizCard key={view.quiz.id} quiz={view.quiz} />
                ))}
              </List>
            ) : (
              <h1 className="mt-8 text-center text-xl">
                No quizzes available :(
              </h1>
            )
          ) : (
            <Loading className="mx-auto h-8 w-8" />
          )}
        </section>
      )}
      <section>
        <h1 className="mb-8 text-4xl font-bold">Most popular</h1>
        <List className="mb-8">
          {data.pages
            .flatMap((data) => data.items)
            .map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
        </List>
        {hasNextPage && (
          <button
            className="mx-auto block p-4 font-semibold hover:underline"
            onClick={() => void fetchNextPage()}
          >
            {isFetching ? <Loading /> : "View more"}
          </button>
        )}
      </section>
    </div>
  );
};

export default Home;
