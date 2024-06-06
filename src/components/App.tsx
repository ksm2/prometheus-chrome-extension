import React from "react";
import { Metrics } from "../model";
import { MetricItem } from "./MetricItem";

export function App({ metrics }: { metrics: Metrics }) {
  return (
    <ul style={{ marginLeft: "-1rem" }}>
      {Object.entries(metrics).map(([key, metric]) => (
        <MetricItem key={key} metric={metric} />
      ))}
    </ul>
  );
}
