import classNames from "classnames";
import React, { useState, MouseEvent } from "react";
import { format } from "../format";
import { Unit } from "../model";
import * as styles from "./styles.module.css";

interface Props {
  unit: Unit;
  children: string;
}

export function ValueWithUnit({ unit, children }: Props) {
  const [original, setOriginal] = useState(false);
  const cn = classNames(styles.ValueWithUnit, { [styles.Original]: original });

  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    setOriginal((o) => !o);
  }

  return (
    <span className={cn} onClick={handleClick}>
      {original ? children : format(children, unit)}
    </span>
  );
}
