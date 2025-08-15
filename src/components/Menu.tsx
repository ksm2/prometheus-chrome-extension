import React, { useContext } from "react";
import { ControllerContext } from "./Controller";
import * as styles from "./prometheus-extension.module.css";

export function Menu() {
  const controller = useContext(ControllerContext)!;

  return (
    <div className={styles.Menu}>
      <button onClick={() => controller.expandAll()}>Expand All</button>
      <button onClick={() => controller.collapseAll()}>Collapse All</button>
    </div>
  );
}
