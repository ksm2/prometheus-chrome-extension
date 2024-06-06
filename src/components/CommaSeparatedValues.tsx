import React, { Fragment, ReactNode } from "react";

export function CommaSeparatedValues({ children }: { children: ReactNode[] }) {
  if (children.length === 0) return null;
  if (children.length === 1) return children[0];

  return (
    <Fragment>
      {children.slice(0, -1).map(addComma)}
      {children.at(-1)}
    </Fragment>
  );
}

function addComma(node: ReactNode, index: number): ReactNode {
  return <Fragment key={index}>{node}, </Fragment>;
}
