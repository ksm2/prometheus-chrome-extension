import classNames from "classnames";
import React from "react";
import { MetricType } from "../lib/model";
import * as styles from "./prometheus-extension.module.css";

export function MetricTypePill({ type }: { type: MetricType }) {
  const formatted = formatType(type);
  return (
    <span className={classNames(styles.MetricType, styles[formatted])}>
      {formatted}
    </span>
  );
}

function formatType(type: MetricType): string {
  switch (type) {
    case "counter":
      return "ctr";
    case "gauge":
      return "gau";
    case "histogram":
      return "his";
    case "gaugehistogram":
      return "ghs";
    case "summary":
      return "sum";
    case "info":
      return "inf";
    case "stateset":
      return "sts";
    default:
      return "unk";
  }
}
