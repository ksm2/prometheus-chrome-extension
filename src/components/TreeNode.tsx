import classNames from "classnames";
import React, { ReactNode, useContext, useLayoutEffect, useState } from "react";
import { TreeContext } from "./Tree";
import * as styles from "./prometheus-extension.module.css";

export function TreeNode({ children }: { children: ReactNode }) {
  const ctx = useContext(TreeContext);
  const [expandable, setExpandable] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cn = classNames(styles.TreeNode, { [styles.Expandable]: expandable });

  useLayoutEffect(() => {
    ctx.setExpandable();
  }, []);

  return (
    <TreeContext.Provider
      value={{
        parent: ctx,
        expandable,
        expanded,
        setExpandable() {
          setExpandable(true);
        },
        toggle() {
          setExpanded((e) => !e);
        },
      }}
    >
      <li className={cn}>{children}</li>
    </TreeContext.Provider>
  );
}
