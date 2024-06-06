import React from "react";
import * as styles from "./styles.module.css";

export function KeyValuePair({ k, v }: { k: string; v: string }) {
  return (
    <>
      <span className={styles.LabelKey}>{k}</span>=
      <span className={styles.LabelValue}>"{v}"</span>
    </>
  );
}
