import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import List from "~/components/Quizzes/QuizList/List";
import QuizCard from "~/components/Quizzes/QuizList/QuizCard";
import LoadingScreen from "~/components/Screens/LoadingScreen";
import Loading from "~/components/UI/Loading";
import { api } from "~/utils/api";

const Search = () => {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetching } =
    api.quiz.search.useInfiniteQuery(
      {
        query: router.query.searchQuery as string,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  if (data === undefined) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>
          Quizity - Search for &quot;{router.query.searchQuery}&quot;
        </title>
      </Head>
      <h1 className="mb-12 text-2xl font-bold md:text-4xl">
        Search results for &quot;{router.query.searchQuery}&quot;
      </h1>
      <List className="mb-12">
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
    </>
  );
};

export default Search;
