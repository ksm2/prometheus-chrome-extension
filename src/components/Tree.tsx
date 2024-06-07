import React, { createContext, ReactNode } from "react";
import * as styles from "./prometheus-extension.module.css";

export interface TreeContextType {
  parent: TreeContextType | null;
  expandable: boolean;
  expanded: boolean;
  setExpandable(): void;
  toggle(): void;
}

export const TreeContext = createContext<TreeContextType>({
  parent: null,
  expandable: false,
  expanded: false,
  setExpandable() {},
  toggle() {},
});

export function Tree({ children }: { children: ReactNode }) {
  return (
    <TreeContext.Provider
      value={{
        parent: null,
        expandable: false,
        expanded: true,
        setExpandable() {},
        toggle() {},
      }}
    >
      <ul className={styles.Tree}>{children}</ul>
    </TreeContext.Provider>
  );
}
