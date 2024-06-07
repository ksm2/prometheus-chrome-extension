import React from "react";
import { Metric } from "../model";
import { MetricType } from "./MetricType";
import { MetricValueItem } from "./MetricValueItem";
import * as styles from "./styles.module.css";
import { TreeChildren } from "./TreeChildren";
import { TreeLabel } from "./TreeLabel";
import { TreeNode } from "./TreeNode";

export function MetricItem({ metric }: { metric: Metric }) {
  return (
    <TreeNode>
      <TreeLabel>
        <MetricType type={metric.type} />
        <span style={{ marginRight: "0.5rem" }}>{metric.name}</span>
        {metric.children.length > 1 ? (
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
      </TreeLabel>
      <TreeChildren>
        {metric.children.map((child, index) => (
          <TreeNode key={index}>
            <TreeLabel>
              <MetricValueItem
                value={child.value}
                labels={child.labels}
                unit={metric.unit}
              />
            </TreeLabel>
          </TreeNode>
        ))}
      </TreeChildren>
    </TreeNode>
  );
}
