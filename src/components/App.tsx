import React, { useState } from "react";
import { Metrics } from "../lib/model";
import { MetricItem } from "./MetricItem";
import { Tree } from "./Tree";
import { Controller } from "./Controller";
import { Menu } from "./Menu";

export function App({ metrics }: { metrics: Metrics }) {
  return (
    <Controller>
      <Menu />
      <Tree>
        {Object.entries(metrics).map(([key, metric]) => (
          <MetricItem key={key} metric={metric} />
        ))}
      </Tree>
    </Controller>
  );
}
