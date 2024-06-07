import React from "react";
import { Metrics } from "../model";
import { MetricItem } from "./MetricItem";
import { Tree } from "./Tree";

export function App({ metrics }: { metrics: Metrics }) {
  return (
    <Tree>
      {Object.entries(metrics).map(([key, metric]) => (
        <MetricItem key={key} metric={metric} />
      ))}
    </Tree>
  );
}
