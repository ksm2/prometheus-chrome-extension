import React, { ReactNode } from "react";

export function SurroundWithBraces({ children }: { children: ReactNode }) {
  return (
    <>
      {"{"}
      {children}
      {"}"}
    </>
  );
}
