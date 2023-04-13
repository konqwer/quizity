import Link from "next/link";
import React from "react";

const Quiz404 = () => {
  return (
    <div className="mx-auto mt-[20vh] space-y-8">
      <h1 className="text-4xl font-bold md:text-5xl">Quiz wasn&apos;t found</h1>
      <h2 className="text-2xl">
        Quiz has been removed, or did not exist at all.
      </h2>
      <Link
        className="block text-xl font-bold text-indigo-600 underline"
        href="/"
      >
        Back to the home page
      </Link>
    </div>
  );
};

export default Quiz404;
