import React from "react";
import {
  HistogramBucket,
  Metric,
  MetricType,
  SummaryQuantile,
  Unit,
} from "../lib/model";
import { MetricTypePill } from "./MetricTypePill";
import { MetricValueItem } from "./MetricValueItem";
import * as styles from "./prometheus-extension.module.css";
import { Tooltip } from "./Tooltip";
import { TreeChildren } from "./TreeChildren";
import { TreeLabel } from "./TreeLabel";
import { TreeNode } from "./TreeNode";
import { LabelDisplay } from "./LabelDisplay";

export function MetricItem({ metric, expandAll, collapseAll }: { metric: Metric, expandAll: boolean, collapseAll: boolean }) {
  const tooltipText = (
    <>
      Type: {prettifyMetricType(metric.type)}
      <br />
      Help: {metric.help ?? "(Not provided)"}
    </>
  );

  return (
    <TreeNode name={metric.name} expandAll={expandAll} collapseAll={collapseAll}>
      <TreeLabel>
        <Tooltip text={tooltipText}>
          <MetricTypePill type={metric.type} />
          <span style={{ marginRight: "0.5rem" }}>{metric.name}</span>
        </Tooltip>
        {metric.children.length > 1 ? (
          <span className={styles.MetricValueItem}>
            <LabelDisplay labels={metric.labels} />
            <span className={styles.MetricCount}>
              {metric.children.length} labels
            </span>
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
            <TreeNode key={index} name={`${metric.name}_bucket_${index}`} expandAll={expandAll} collapseAll={collapseAll}>
              <TreeLabel>
                <BucketValueItem bucket={bucket} />
              </TreeLabel>
            </TreeNode>
          ))}
        {metric.value?.type === "summary" &&
          metric.value.quantiles.map((quantile, index) => (
            <TreeNode key={index} name={`${metric.name}_quantile_${index}`} expandAll={expandAll} collapseAll={collapseAll}>
              <TreeLabel>
                <QuantileValueItem quantile={quantile} unit={metric.unit} />
              </TreeLabel>
            </TreeNode>
          ))}

        {metric.children.map((child, index) => (
          <TreeNode key={index} name={`${metric.name}_child_${index}`} expandAll={expandAll} collapseAll={collapseAll}>
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
                  <TreeNode key={index} name={`${metric.name}_child_${index}_bucket_${index}`} expandAll={expandAll} collapseAll={collapseAll}>
                    <TreeLabel>
                      <BucketValueItem bucket={bucket} />
                    </TreeLabel>
                  </TreeNode>
                ))}
              {child.value?.type === "summary" &&
                child.value.quantiles.map((quantile, index) => (
                  <TreeNode key={index} name={`${metric.name}_child_${index}_quantile_${index}`} expandAll={expandAll} collapseAll={collapseAll}>
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

function prettifyMetricType(metricType: MetricType): string {
  switch (metricType) {
    case "counter":
      return "Counter";
    case "gauge":
      return "Gauge";
    case "histogram":
      return "Histogram";
    case "gaugehistogram":
      return "Gauge Histogram";
    case "info":
      return "Info";
    case "stateset":
      return "State Set";
    case "summary":
      return "Summary";
    default:
      return "Unknown";
  }
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
