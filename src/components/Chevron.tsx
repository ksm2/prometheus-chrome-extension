import classNames from "classnames";
import React from "react";
import * as styles from "./styles.module.css";

export function Chevron({ open }: { open: boolean }) {
  return (
    <div
      className={classNames(styles.Chevron, { [styles.ChevronOpen]: open })}
    />
  );
}
