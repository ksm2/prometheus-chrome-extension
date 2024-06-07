import React, { ReactNode, useContext } from "react";
import { TreeContext } from "./Tree";

export function TreeChildren({ children }: { children: ReactNode }) {
  const ctx = useContext(TreeContext);
  return (
    <ul
      style={{ paddingLeft: "1rem", display: ctx.expanded ? "block" : "none" }}
    >
      {children}
    </ul>
  );
}
