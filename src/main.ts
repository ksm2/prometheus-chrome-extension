import { aggregate } from "./lib/aggregate";
import { findPreWithCode } from "./lib/findPre";
import { parse } from "./lib/parse";
import { render } from "./lib/render";

function onLoad() {
  const pre = findPreWithCode();
  if (!pre) return;

  const text = pre.textContent ?? "";
  const lines = parse(text);
  if (lines.length === 0) return;

  const metrics = aggregate(lines);
  render(pre, metrics);
}

document.addEventListener("DOMContentLoaded", onLoad, false);
