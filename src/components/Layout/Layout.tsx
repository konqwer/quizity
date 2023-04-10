import React, { type ReactNode, type FC } from "react";
import Header from "./Header/Header";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-screen-xl overflow-hidden px-4 py-8">
        {children}
      </div>
    </>
  );
};

export default Layout;
