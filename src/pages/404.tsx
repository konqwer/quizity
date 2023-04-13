import React from "react";
import Link from "next/link";

const Page404 = () => {
  return (
    <div className="mx-auto mt-[20vh] space-y-8">
      <h1 className="text-4xl font-bold md:text-5xl">Page wasn&apos;t found</h1>
      <Link
        className="block text-xl font-bold text-indigo-600 underline"
        href="/"
      >
        Back to the home page
      </Link>
    </div>
  );
};

export default Page404;
