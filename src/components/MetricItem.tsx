import React, { useState } from "react";
import { Metric } from "../model";
import { Chevron } from "./Chevron";
import { MetricType } from "./MetricType";
import { MetricValueItem } from "./MetricValueItem";
import * as styles from "./styles.module.css";

export function MetricItem({ metric }: { metric: Metric }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className={styles.MetricItem}>
      <button onClick={() => setExpanded((e) => !e)}>
        <Chevron open={expanded} />
        <MetricType type={metric.type} />
        <span>{metric.name}</span>
        {metric.values.length > 1 && (
          <span className={styles.MetricCount}>
            {metric.values.length} metrics
          </span>
        )}
      </button>
      <ul style={{ display: expanded ? "block" : "none" }}>
        {metric.values.map((value, index) => (
          <MetricValueItem key={index} value={value} unit={metric.unit} />
        ))}
      </ul>
    </li>
  );
}
