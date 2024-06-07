import classNames from "classnames";
import React from "react";
import * as styles from "./prometheus-extension.module.css";

export function Chevron({ open }: { open: boolean }) {
  return (
    <div
      className={classNames(styles.Chevron, { [styles.ChevronOpen]: open })}
    />
  );
}
