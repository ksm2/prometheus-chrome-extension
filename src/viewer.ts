import { aggregate } from "./aggregate";
import { findPreWithCode } from "./findPre";
import { parse } from "./parse";

function onLoad() {
  const pre = findPreWithCode();
  if (!pre) return;

  const text = pre.textContent ?? "";
  const lines = parse(text);
  const metrics = aggregate(lines);
  console.log(metrics);
}

document.addEventListener("DOMContentLoaded", onLoad, false);
