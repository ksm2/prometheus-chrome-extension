import React from "react";
import { HistogramBucket, Metric, SummaryQuantile, Unit } from "../lib/model";
import { MetricType } from "./MetricType";
import { MetricValueItem } from "./MetricValueItem";
import * as styles from "./prometheus-extension.module.css";
import { Tooltip } from "./Tooltip";
import { TreeChildren } from "./TreeChildren";
import { TreeLabel } from "./TreeLabel";
import { TreeNode } from "./TreeNode";

export function MetricItem({ metric }: { metric: Metric }) {
  const tooltipText = (
    <>
      Type: {capitalize(metric.type ?? "unknown")}
      <br />
      Help: {metric.help}
    </>
  );

  return (
    <TreeNode>
      <TreeLabel>
        <Tooltip text={tooltipText}>
          <MetricType type={metric.type} />
          <span style={{ marginRight: "0.5rem" }}>{metric.name}</span>
        </Tooltip>
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

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
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
