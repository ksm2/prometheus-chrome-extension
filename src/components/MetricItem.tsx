import classNames from "classnames";
import React, { useState } from "react";
import { Metric } from "../model";
import { Chevron } from "./Chevron";
import { MetricType } from "./MetricType";
import { MetricValueItem } from "./MetricValueItem";
import * as styles from "./styles.module.css";

export function MetricItem({ metric }: { metric: Metric }) {
  const [expanded, setExpanded] = useState(false);
  const expandable = metric.children.length > 1;
  const cn = classNames(styles.MetricItem, { [styles.Expandable]: expandable });

  return (
    <li className={cn}>
      <button onClick={() => setExpanded((e) => !e)}>
        {expandable && <Chevron open={expanded} />}
        <MetricType type={metric.type} />
        <span style={{ marginRight: "0.5rem" }}>{metric.name}</span>
        {expandable ? (
          <span className={styles.MetricCount}>
            {metric.children.length} labels
          </span>
        ) : metric.value ? (
          <MetricValueItem
            value={metric.value}
            labels={metric.labels}
            unit={metric.unit}
          />
        ) : (
          <span className={styles.MetricCount}>no values</span>
        )}
      </button>
      {expandable && (
        <ul style={{ display: expanded ? "block" : "none" }}>
          {metric.children.map((child, index) => (
            <li>
              <MetricValueItem
                key={index}
                value={child.value}
                labels={child.labels}
                unit={metric.unit}
              />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
