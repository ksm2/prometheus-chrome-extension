import { findPreWithCode } from "./findPre";
import { parse } from "./parse";

function onLoad() {
  const pre = findPreWithCode();
  if (!pre) return;

  const text = pre.textContent ?? "";
  const metrics = parse(text);
  console.log(metrics);
}

document.addEventListener("DOMContentLoaded", onLoad, false);
