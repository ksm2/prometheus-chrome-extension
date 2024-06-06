import classNames from "classnames";
import React from "react";
import * as styles from "./styles.module.css";

export function MetricType({ type }: { type?: string }) {
  const formatted = formatType(type);
  return (
    <span className={classNames(styles.MetricType, styles[formatted])}>
      {formatted}
    </span>
  );
}

function formatType(type?: string): string {
  switch (type) {
    case "counter":
      return "ctr";
    case "gauge":
      return "gau";
    case "histogram":
      return "his";
    case "summary":
      return "sum";
    default:
      return "unk";
  }
}
