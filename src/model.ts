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
  labels: Labels;
  children: ChildMetric[];
  value?: string;
}

export interface ChildMetric {
  unit?: Unit;
  labels: Labels;
  value: string;
}

export type Unit =
  | "minutes"
  | "seconds"
  | "millis"
  | "micros"
  | "nanos"
  | "bytes";

export interface Labels {
  [key: string]: string;
}
