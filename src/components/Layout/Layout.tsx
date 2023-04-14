import React, { type ReactNode, type FC } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-screen-xl grow overflow-hidden px-4 py-8">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
