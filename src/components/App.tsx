import React from "react";
import { Metrics } from "../model";
import { MetricItem } from "./MetricItem";
import * as styles from "./styles.module.css";

export function App({ metrics }: { metrics: Metrics }) {
  return (
    <ul className={styles.MetricList}>
      {Object.entries(metrics).map(([key, metric]) => (
        <MetricItem key={key} metric={metric} />
      ))}
    </ul>
  );
}
