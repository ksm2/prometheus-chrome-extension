export type Line = InstructionLine | MetricLine;

export interface InstructionLine {
  type: "instruction";
  instr: "TYPE" | "HELP" | "UNIT" | string;
  name: string;
  value: string;
}

export function instruction(
  instr: "TYPE" | "HELP" | "UNIT",
  name: string,
  value: string,
): InstructionLine {
  return { type: "instruction", instr, name, value };
}

export interface MetricLine {
  type: "metric";
  name: string;
  labels: Labels;
  value: string;
  timestamp?: number;
}

export function metric(
  name: string,
  value: string,
  labels: Labels = {},
  timestamp?: number,
): MetricLine {
  return { type: "metric", name, labels, value, timestamp };
}

export interface Metrics {
  [name: string]: Metric;
}

export interface Metric {
  name: string;
  type: MetricType;
  help?: string;
  unit?: Unit;
  labels: Labels;
  children: ChildMetric[];
  value?: MetricValue;
}

export type MetricType =
  | "counter"
  | "gauge"
  | "histogram"
  | "gaugehistogram"
  | "stateset"
  | "info"
  | "summary"
  | "unknown";

export interface ChildMetric {
  unit?: Unit;
  labels: Labels;
  value: MetricValue;
}

export type MetricValue = Literal | Histogram | Summary;

export interface Literal {
  type: "literal";
  value: string;
}

export interface Histogram {
  type: "histogram";
  buckets: HistogramBucket[];
  sum?: string;
  count?: string;
}

export interface HistogramBucket {
  le: string;
  value: string;
}

export interface Summary {
  type: "summary";
  quantiles: SummaryQuantile[];
  sum?: string;
  count?: string;
}

export interface SummaryQuantile {
  quantile: string;
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
