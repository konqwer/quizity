import { useAutoAnimate } from "@formkit/auto-animate/react";
import React, { type FC, type ReactNode } from "react";

const List: FC<{ children: ReactNode[]; className: string }> = ({
  children,
  className,
}) => {
  const [parent] = useAutoAnimate();

  return (
    <div
      ref={parent}
      className={`grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-12 ${className}`}
    >
      {children}
    </div>
  );
};

export default List;
