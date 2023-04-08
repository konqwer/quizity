import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Nav from "./Nav";

const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="border-b">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-10 p-4">
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-600 hover:text-indigo-500"
        >
          Quizity
        </Link>
        {sessionData !== undefined && <Nav sessionData={sessionData} />}
      </div>
    </div>
  );
};

export default Header;
