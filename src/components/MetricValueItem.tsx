import React from "react";
import { MetricValue, Unit } from "../model";
import { LabelDisplay } from "./LabelDisplay";
import * as styles from "./styles.module.css";
import { ValueWithOptionalUnit } from "./ValueWithOptionalUnit";

interface Props {
  value: MetricValue;
  unit?: Unit;
}

export function MetricValueItem({ value, unit }: Props) {
  return (
    <span className={styles.MetricValueItem}>
      <ValueWithOptionalUnit unit={unit}>{value.value}</ValueWithOptionalUnit>{" "}
      <LabelDisplay labels={value.labels} />
    </span>
  );
}
