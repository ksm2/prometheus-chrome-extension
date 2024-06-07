import React from "react";
import { Labels } from "../model";
import { CommaSeparatedValues } from "./CommaSeparatedValues";
import { KeyValuePair } from "./KeyValuePair";
import { SurroundWithBraces } from "./SurroundWithBraces";
import * as styles from "./prometheus-extension.module.css";

export function LabelDisplay({ labels }: { labels: Labels }) {
  const entries = Object.entries(labels);
  if (entries.length === 0) return null;

  return (
    <span className={styles.LabelDisplay}>
      <SurroundWithBraces>
        <CommaSeparatedValues>
          {entries.map(([k, v]) => (
            <KeyValuePair key={k} k={k} v={v} />
          ))}
        </CommaSeparatedValues>
      </SurroundWithBraces>
    </span>
  );
}
