import React, { useState, Fragment } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  FaBook,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaUserAlt,
} from "react-icons/fa";
import { Menu, Popover, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import Loading from "~/components/UI/Loading";

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
        className={`flex h-full w-full items-center gap-4 rounded-full bg-gray-200 px-4 py-1.5 ring-2 ring-inset transition-all duration-75 ${
          focus ? "ring-indigo-500" : "ring-gray-200"
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
    <Popover as="div" className="h-full md:hidden">
      <Popover.Button className="flex aspect-square h-full items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500">
        <FaSearch className="fill-white" />
      </Popover.Button>
      <Transition
        as={Fragment}
        leave="transition-opacity"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Panel className="absolute inset-x-0 top-0 z-20 flex h-16 items-center bg-gray-100 p-4">
          <SearchInput />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
const Search = () => {
  return (
    <div className="hidden h-full grow md:block">
      <SearchInput />
    </div>
  );
};
const ProfileMenu = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  return sessionData !== undefined ? (
    sessionData === null ? (
      <button
        className="white h-full whitespace-nowrap rounded-full bg-indigo-600 px-4 text-sm font-bold text-white hover:bg-indigo-500"
        onClick={() => void signIn()}
      >
        Sign in
      </button>
    ) : (
      <div className="flex h-full items-center gap-2">
        <Menu as="div" className="relative aspect-square h-full">
          <Menu.Button>
            <Image
              width="64"
              height="64"
              alt="profile-image"
              src={sessionData.user.image || ""}
              className="h-full rounded-full"
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-md ring-1 ring-gray-200 focus:outline-none">
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
                      <h1 className="font-bold text-gray-600">
                        {sessionData.user.name}
                      </h1>
                    </div>
                  )}
                </Menu.Item>
              </div>
              <div className="p-1">
                {[
                  { name: "Profile", href: "/profile", icon: FaUserAlt },
                  { name: "Library", href: "/library", icon: FaBook },
                  { name: "Create quiz", href: "/quiz/create", icon: FaPlus },
                ].map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <Link
                        href={item.href}
                        className={`${
                          active ? "bg-indigo-500 text-white" : "text-gray-600"
                        } flex w-full items-center gap-2 rounded-md p-2 text-sm font-bold`}
                      >
                        <item.icon />
                        {item.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
              <div className="p-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-red-500 text-white" : "text-gray-600"
                      } flex w-full items-center gap-2 rounded-md p-2 text-sm font-bold`}
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={async () => {
                        await router.push("/");
                        await signOut();
                      }}
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
        <Link
          href="/profile"
          className="hidden text-sm font-bold text-gray-600 transition-colors hover:text-indigo-600 md:block "
        >
          Profile
        </Link>
      </div>
    )
  ) : (
    <Loading className="h-full w-10 text-indigo-600"></Loading>
  );
};

const Header = () => {
  return (
    <div className="border-b">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-12 p-4">
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-600 hover:text-indigo-500"
        >
          Quizity
        </Link>
        <div className="flex h-full w-1/2 grow items-center gap-8">
          {[
            { name: "Home", href: "/" },
            { name: "Library", href: "/library" },
            { name: "Create quiz", href: "/quiz/create" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hidden text-sm font-bold text-gray-600 transition-colors hover:text-indigo-600 md:block"
            >
              {item.name}
            </Link>
          ))}
          <Search />
        </div>
        <div className="flex h-full items-center gap-2">
          <MobileSearch />
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};

export default Header;
