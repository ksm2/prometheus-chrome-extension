import classNames from "classnames";
import React, { MouseEvent, useState } from "react";
import * as styles from "./prometheus-extension.module.css";

interface Props {
  text?: React.ReactNode;
  children?: React.ReactNode;
}

export function Tooltip({ text, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const cn = classNames(styles.Tooltip, { [styles.Visible]: visible });

  function handleMouseEnter(e: MouseEvent) {
    setVisible(true);
    handleMouseMove(e);
  }

  function handleMouseLeave() {
    setVisible(false);
  }

  function handleMouseMove(e: MouseEvent) {
    setX(e.clientX + 10);
    setY(e.clientY + 16);
  }

  if (!text) {
    return <>{children}</>;
  }

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      <div className={cn} style={{ left: x, top: y }}>
        {text}
      </div>
    </span>
  );
}
