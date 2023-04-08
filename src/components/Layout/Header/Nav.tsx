import Link from "next/link";
import React, { useState, useEffect, type FC, Fragment } from "react";
import Image from "next/image";
import { type Session } from "next-auth";
import {
  FaBook,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaUserAlt,
} from "react-icons/fa";
import { signIn, signOut } from "next-auth/react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { useRouter } from "next/router";

const SearchInput = () => {
  const [focus, setFocus] = useState(false);
  const router = useRouter();
  const submitHandler: React.FormEventHandler = (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & { input: HTMLInputElement };
    if (form.input.value !== "") {
      form.input.value = "";
      void router.replace(`/search/${form.input.value}`);
    }
  };
  return (
    <>
      <form
        onSubmit={submitHandler}
        className={`flex h-full w-full items-center gap-4 rounded-full bg-gray-200 px-4 py-1.5 ring-1 ring-inset transition-all duration-75 ${
          focus ? "ring-indigo-500" : "ring-gray-400"
        }`}
      >
        <FaSearch
          className={`fill-gray-400 transition-all duration-75 ${
            focus ? "fill-indigo-500" : ""
          }`}
        />
        <input
          onBlur={() => setFocus(false)}
          onFocus={() => setFocus(true)}
          className="w-full bg-transparent placeholder:text-gray-400 focus:outline-none"
          placeholder="Quizzes, courses, etc."
          autoFocus
        />
      </form>
    </>
  );
};
const MobileSearch = () => {
  return (
    <Popover as="div" className="md:hidden">
      <Popover.Button className="h-full">
        <button className="flex aspect-square h-full items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 ">
          <FaSearch className="fill-white" />
        </button>
      </Popover.Button>
      <Transition
        as={Fragment}
        leave="transition-opacity"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Panel className="absolute inset-x-0 top-4 z-20 flex h-10 items-center px-4">
          <SearchInput />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
const Search = () => {
  return (
    <div className="hidden grow md:block">
      <SearchInput />
    </div>
  );
};

const ProfileMenu: FC<{ sessionData: Session }> = ({ sessionData }) => {
  return (
    <Menu as="div" className="relative aspect-square">
      <div>
        <Menu.Button>
          <Image
            width="64"
            height="64"
            alt="profile-image"
            src={sessionData.user.image || ""}
            className="rounded-full"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-md ring-1 ring-gray-200 focus:outline-none">
          <div className="p-1">
            <Menu.Item>
              {() => (
                <div className="flex w-full items-center gap-2 p-2">
                  <Image
                    width="64"
                    height="64"
                    alt="profile-image"
                    src={sessionData.user.image || ""}
                    className="aspect-square w-12 rounded-full"
                  />
                  <h1>{sessionData.user.name}</h1>
                </div>
              )}
            </Menu.Item>
          </div>
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/profile"
                  className={`${
                    active ? "bg-indigo-500 text-white" : ""
                  } flex w-full items-center gap-2 rounded-md p-2 text-sm`}
                >
                  <FaUserAlt />
                  Profile
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/library"
                  className={`${
                    active ? "bg-indigo-500 text-white" : ""
                  } flex w-full items-center gap-2 rounded-md p-2 text-sm`}
                >
                  <FaBook />
                  My library
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-indigo-500 text-white" : ""
                  } flex w-full items-center gap-2 rounded-md p-2 text-sm`}
                  onClick={() => void signOut()}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const Nav: FC<{ sessionData: Session | null }> = ({ sessionData }) => {
  return (
    <div className="flex h-10 grow justify-end gap-4">
      <Search />
      <MobileSearch />
      {sessionData === null ? (
        <button
          className="rounded-full bg-indigo-600 px-4 text-sm font-bold text-white hover:bg-indigo-500"
          onClick={() => void signIn()}
        >
          Sign in
        </button>
      ) : (
        <>
          <Link
            href="add"
            className="flex aspect-square items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500"
          >
            <FaPlus className="fill-white" />
          </Link>
          <ProfileMenu sessionData={sessionData} />
        </>
      )}
    </div>
  );
};

export default Nav;
