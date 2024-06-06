import React from "react";
import { Unit } from "../model";
import { ValueWithUnit } from "./ValueWithUnit";

interface Props {
  unit?: Unit;
  children: string;
}

export function ValueWithOptionalUnit({ unit, children }: Props) {
  return unit ? (
    <ValueWithUnit unit={unit}>{children}</ValueWithUnit>
  ) : (
    children
  );
}
