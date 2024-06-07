import React from "react";
import { Labels, MetricValue, Unit } from "../model";
import { LabelDisplay } from "./LabelDisplay";
import { ValueWithOptionalUnit } from "./ValueWithOptionalUnit";
import * as styles from "./styles.module.css";

interface Props {
  value: MetricValue;
  labels: Labels;
  unit?: Unit;
}

export function MetricValueItem({ value, labels, unit }: Props) {
  switch (value.type) {
    case "literal":
      return (
        <span className={styles.MetricValueItem}>
          <LabelDisplay labels={labels} />
          <ValueWithOptionalUnit unit={unit}>
            {value.value}
          </ValueWithOptionalUnit>
        </span>
      );
    case "histogram":
      return (
        <span className={styles.MetricValueItem}>
          <LabelDisplay labels={labels} />
          <span>N={value.count}</span>
          <span>
            Σ=
            {value.sum && (
              <ValueWithOptionalUnit unit={unit}>
                {value.sum}
              </ValueWithOptionalUnit>
            )}
          </span>
          <span className={styles.MetricCount}>
            {value.buckets.length} buckets
          </span>
        </span>
      );
  }
}
