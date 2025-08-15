import classNames from "classnames";
import React, {
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { TreeContext } from "./Tree";
import * as styles from "./prometheus-extension.module.css";
import { readExpanded, writeExpanded } from "../lib/localStorage";

export function TreeNode({
  children,
  name,
  expandAll,
  collapseAll,
}: {
  children: ReactNode;
  name: string;
  expandAll: boolean;
  collapseAll: boolean;
}) {
  const ctx = useContext(TreeContext);
  const [expandable, setExpandable] = useState(false);
  const [expanded, setExpanded] = useState<boolean>(() => readExpanded(name));
  const cn = classNames(styles.TreeNode, { [styles.Expandable]: expandable });

  useLayoutEffect(() => {
    ctx.setExpandable();
  }, []);

  useEffect(() => {
    writeExpanded(name, expanded);
  }, [expanded]);

  useEffect(() => {
    if (expandAll) {
      setExpanded(true);
    }
  }, [expandAll]);

  useEffect(() => {
    if (collapseAll) {
      setExpanded(false);
    }
  }, [collapseAll]);

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
