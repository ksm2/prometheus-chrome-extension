import React, { ReactNode, useContext } from "react";
import { Chevron } from "./Chevron";
import { TreeContext } from "./Tree";
import * as styles from "./prometheus-extension.module.css";

export function TreeLabel({ children }: { children: ReactNode }) {
  const ctx = useContext(TreeContext);

  return (
    <button className={styles.TreeLabel} onClick={() => ctx.toggle()}>
      {ctx.expandable && <Chevron open={ctx.expanded} />}
      {children}
    </button>
  );
}
