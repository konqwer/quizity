import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FaEllipsisV } from "react-icons/fa";
import { signOut } from "next-auth/react";

const HeaderMenu = () => {
  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button>
          <FaEllipsisV className="fill-indigo-600" />
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
        <Menu.Items className="absolute right-0 origin-top-right overflow-hidden rounded-md border bg-white  shadow-md">
          <Menu.Item>
            {
              <button
                className="w-full px-2 py-1 pr-12 text-left hover:bg-indigo-200"
                onClick={() => void signOut()}
              >
                Logout
              </button>
            }
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default HeaderMenu;
