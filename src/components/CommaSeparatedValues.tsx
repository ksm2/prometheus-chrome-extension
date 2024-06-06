import React, { ReactNode } from "react";

export function CommaSeparatedValues({ children }: { children: ReactNode[] }) {
  if (children.length === 0) return null;
  if (children.length === 1) return children[0];

  return (
    <>
      {children.slice(0, -1).map(addComma)}
      {children.at(-1)}
    </>
  );
}

function addComma(node: ReactNode): ReactNode {
  return <>{node}, </>;
}
