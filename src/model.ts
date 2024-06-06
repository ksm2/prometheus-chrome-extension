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
  name: string;
  type?: string;
  help?: string;
  unit?: Unit;
  values: MetricValue[];
}

export type Unit =
  | "minutes"
  | "seconds"
  | "millis"
  | "micros"
  | "nanos"
  | "bytes";

export interface MetricValue {
  labels: Labels;
  value: string;
  kind?: string;
}

export interface Labels {
  [key: string]: string;
}
