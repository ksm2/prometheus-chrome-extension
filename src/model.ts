export type Line = InstructionLine | MetricLine;

export interface InstructionLine {
  type: "instruction";
  instr: "TYPE" | "HELP" | string;
  name: string;
  value: string;
}

export interface MetricLine {
  type: "metric";
  name: string;
  labels: Labels;
  value: string;
}

export interface Metrics {
  [name: string]: Metric;
}

export interface Metric {
  type?: string;
  help?: string;
  values?: MetricValue[];
}

export interface MetricValue {
  labels: Labels;
  value: string;
  kind?: string;
}

export interface Labels {
  [key: string]: string;
}
