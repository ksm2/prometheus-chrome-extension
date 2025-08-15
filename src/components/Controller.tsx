import React, { createContext, ReactNode } from "react";

interface Listener {
  (expanded: boolean): void;
}

export const ControllerContext = createContext<ControllerEmitter | undefined>(
  undefined,
);

export class ControllerEmitter {
  private readonly listeners = new Set<Listener>();

  expandAll() {
    this.emit(true);
  }

  collapseAll() {
    this.emit(false);
  }

  addListener(listener: Listener) {
    this.listeners.add(listener);
  }

  removeListener(listener: Listener) {
    this.listeners.delete(listener);
  }

  private emit(expanded: boolean) {
    for (const listener of this.listeners) {
      listener(expanded);
    }
  }
}

export function Controller({ children }: { children: ReactNode }) {
  return (
    <ControllerContext.Provider value={new ControllerEmitter()}>
      {children}
    </ControllerContext.Provider>
  );
}
