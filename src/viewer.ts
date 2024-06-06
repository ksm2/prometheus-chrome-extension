import { aggregate } from "./aggregate";
import { findPreWithCode } from "./findPre";
import { parse } from "./parse";
import { render } from "./render";

function onLoad() {
  const pre = findPreWithCode();
  if (!pre) return;

  const text = pre.textContent ?? "";
  const lines = parse(text);
  const metrics = aggregate(lines);
  render(pre, metrics);
}

document.addEventListener("DOMContentLoaded", onLoad, false);
