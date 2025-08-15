import classNames from "classnames";
import React, {
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ControllerContext } from "./Controller";
import { TreeContext } from "./Tree";
import * as styles from "./prometheus-extension.module.css";
import { readExpanded, writeExpanded } from "../lib/localStorage";

export function TreeNode({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}) {
  const ctx = useContext(TreeContext);
  const controller = useContext(ControllerContext)!;
  const [expandable, setExpandable] = useState(false);
  const [expanded, setExpanded] = useState<boolean>(() => readExpanded(name));
  const cn = classNames(styles.TreeNode, { [styles.Expandable]: expandable });

  useLayoutEffect(() => {
    ctx.setExpandable();

    function onToggleAll(expanded: boolean) {
      setExpanded(expanded);
    }

    controller.addListener(onToggleAll);

    return () => {
      controller.removeListener(onToggleAll);
    };
  }, []);

  useEffect(() => {
    writeExpanded(name, expanded);
  }, [expanded]);

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
