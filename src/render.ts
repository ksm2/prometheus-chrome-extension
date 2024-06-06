import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { Metrics } from "./model";

export function render(replace: HTMLPreElement, metrics: Metrics) {
  const div = replace.ownerDocument.createElement("div");
  const root = createRoot(div);
  root.render(React.createElement(App, { metrics }));
  replace.parentElement!.append(div);
  replace.remove();
}
