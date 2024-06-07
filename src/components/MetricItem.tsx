import React from "react";
import { HistogramBucket, Metric, SummaryQuantile, Unit } from "../model";
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
        {metric.value?.type === "histogram" &&
          metric.value.buckets.map((bucket, index) => (
            <TreeNode key={index}>
              <TreeLabel>
                <BucketValueItem bucket={bucket} />
              </TreeLabel>
            </TreeNode>
          ))}
        {metric.value?.type === "summary" &&
          metric.value.quantiles.map((quantile, index) => (
            <TreeNode key={index}>
              <TreeLabel>
                <QuantileValueItem quantile={quantile} unit={metric.unit} />
              </TreeLabel>
            </TreeNode>
          ))}

        {metric.children.map((child, index) => (
          <TreeNode key={index}>
            <TreeLabel>
              <MetricValueItem
                value={child.value}
                labels={child.labels}
                unit={metric.unit}
              />
            </TreeLabel>
            <TreeChildren>
              {child.value.type === "histogram" &&
                child.value.buckets.map((bucket, index) => (
                  <TreeNode key={index}>
                    <TreeLabel>
                      <BucketValueItem bucket={bucket} />
                    </TreeLabel>
                  </TreeNode>
                ))}
              {child.value?.type === "summary" &&
                child.value.quantiles.map((quantile, index) => (
                  <TreeNode key={index}>
                    <TreeLabel>
                      <QuantileValueItem
                        quantile={quantile}
                        unit={metric.unit}
                      />
                    </TreeLabel>
                  </TreeNode>
                ))}
            </TreeChildren>
          </TreeNode>
        ))}
      </TreeChildren>
    </TreeNode>
  );
}

function BucketValueItem({ bucket }: { bucket: HistogramBucket }) {
  return (
    <MetricValueItem
      value={{ type: "literal", value: bucket.value }}
      labels={{ le: bucket.le }}
    />
  );
}

function QuantileValueItem({
  quantile,
  unit,
}: {
  quantile: SummaryQuantile;
  unit?: Unit;
}) {
  return (
    <MetricValueItem
      value={{ type: "literal", value: quantile.value }}
      labels={{ quantile: quantile.quantile }}
      unit={unit}
    />
  );
}
