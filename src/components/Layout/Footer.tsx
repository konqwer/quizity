import Link from "next/link";
import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="border-t">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-center gap-4 p-4">
        <a
          target="_blank"
          href="https://github.com/konqwer/quizity"
          className="hover:text-indigo-500"
        >
          <FaGithub className="h-8 w-8" />
        </a>
        <h1>
          Made by
          <a
            className="ml-1 text-indigo-600 underline hover:text-indigo-500"
            target="_blank"
            href="https://github.com/konqwer"
          >
            konqwer
          </a>
        </h1>
      </div>
    </div>
  );
};

export default Footer;
