import React from "react";
import { Labels, Unit } from "../model";
import { LabelDisplay } from "./LabelDisplay";
import { ValueWithOptionalUnit } from "./ValueWithOptionalUnit";
import * as styles from "./styles.module.css";

interface Props {
  value: string;
  labels: Labels;
  unit?: Unit;
}

export function MetricValueItem({ value, labels, unit }: Props) {
  return (
    <span className={styles.MetricValueItem}>
      <LabelDisplay labels={labels} />
      <ValueWithOptionalUnit unit={unit}>{value}</ValueWithOptionalUnit>
    </span>
  );
}
