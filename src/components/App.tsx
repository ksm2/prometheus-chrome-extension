import React, { useState } from "react";
import { Metrics } from "../lib/model";
import { MetricItem } from "./MetricItem";
import { Tree } from "./Tree";

export function App({ metrics }: { metrics: Metrics }) {
  const [expandAll, setExpandAll] = useState(false);
  const [collapseAll, setCollapseAll] = useState(false);

  return (
    <>
      <button onClick={() => setExpandAll(true)}>Expand All</button>
      <button onClick={() => setCollapseAll(true)}>Collapse All</button>
      <Tree>
        {Object.entries(metrics).map(([key, metric]) => (
          <MetricItem key={key} metric={metric} expandAll={expandAll} collapseAll={collapseAll} />
        ))}
      </Tree>
    </>
  );
}
