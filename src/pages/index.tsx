import { type NextPage } from "next";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="grid h-[200px] w-full grid-cols-1 gap-2 text-2xl font-bold text-white md:grid-cols-2 md:text-5xl">
      <div className="row-start-1 row-end-3 rounded-md bg-sky-500 p-8">
        <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-white before:transition-transform hover:before:skew-y-3">
          <span className="relative text-sky-500">Quizity</span>
        </span>{" "}
        - platform for users to create, join, and learn from quizzes
      </div>
      <button className="flex items-center justify-center rounded-md bg-green-500 p-8 transition-transform hover:scale-105">
        Create your first quiz
      </button>
      <button className="flex items-center justify-center rounded-md bg-fuchsia-500 p-8 transition-transform hover:-skew-x-1 hover:-skew-y-1">
        Join game
      </button>
    </div>
  );
};
const Home: NextPage = () => {
  return <Hero />;
};

export default Home;
