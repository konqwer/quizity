import React, { type ReactNode, type FC } from "react";
import Header from "./Header/Header";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-screen-2xl p-4">{children}</div>
    </>
  );
};

export default Layout;
