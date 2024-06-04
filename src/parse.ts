export function parse(input: string): Metrics {
  const lines = splitLines(input)
    .filter((line) => line.length > 0)
    .map(parseLine)
    .filter(Boolean);

  console.log(lines);

  return {} satisfies Metrics;
}

function splitLines(input: string): string[] {
  if (input.length === 0) return [];

  return input.split(/\r\n|[\r\n]/g);
}

const INSTR_PATTERN = /^#\s+(?<instr>\w+)\s+(?<name>.*?)\s+(?<value>.*)$/;

const METRIC_PATTERN =
  /^(?<name>[a-zA-Z0-9_]+)(\{(?<labels>.*)})?\s+(?<value>.*)$/;

function parseLine(line: string): Line | null {
  const instrMatch = INSTR_PATTERN.exec(line);
  if (instrMatch) {
    const { instr, name, value } = instrMatch.groups!;
    return {
      type: "instruction",
      instr,
      name,
      value,
    } satisfies InstructionLine;
  }

  const metricMatch = METRIC_PATTERN.exec(line);
  if (metricMatch) {
    const { name, labels: rawLabels, value } = metricMatch.groups!;
    const labels = normalizeRawLabels(rawLabels);
    return { type: "metric", name, labels, value } satisfies MetricLine;
  }

  return null;
}

function normalizeRawLabels(rawLabels?: string): { [key: string]: string } {
  if (!rawLabels) return {};

  const trimmed = rawLabels.trim();
  if (trimmed.length === 0) return {};

  const keyValuePairs = trimmed.split(",");
  return Object.fromEntries(keyValuePairs.map(splitKeyValuePair));
}

const KV_PATTERN = /(?<key>.*)="(?<value>.*)"/;

function splitKeyValuePair(kv: string): [string, string] {
  const match = KV_PATTERN.exec(kv);
  if (!match) return ["", ""];

  const { key, value } = match.groups!;
  return [key, value];
}

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
  labels: { [key: string]: string };
  value: string;
}

export interface Metrics {}
