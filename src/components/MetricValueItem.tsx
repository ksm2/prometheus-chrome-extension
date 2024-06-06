import React from "react";
import { MetricValue } from "../model";
import { LabelDisplay } from "./LabelDisplay";
import * as styles from "./styles.module.css";

export function MetricValueItem({ value }: { value: MetricValue }) {
  return (
    <li className={styles.MetricValueItem}>
      {value.value} <LabelDisplay labels={value.labels} />
    </li>
  );
}
