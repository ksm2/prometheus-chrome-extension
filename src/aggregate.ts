import { InstructionLine, MetricLine, Metrics } from "./model";

export function aggregate(lines: (InstructionLine | MetricLine)[]) {
  const metrics: Metrics = {};
  for (const line of lines) {
    if (line.type === "instruction") {
      metrics[line.name] ??= { name: line.name, values: [] };
      if (line.instr === "TYPE") {
        metrics[line.name].type = line.value;
      } else if (line.instr === "HELP") {
        metrics[line.name].help = line.value;
      }
    } else if (line.type === "metric") {
      const { name, kind } = getMetricName(line);

      metrics[name] ??= { name, values: [] };
      metrics[name].values.push({
        labels: line.labels,
        value: line.value,
        kind,
      });
    }
  }
  return sortMetrics(metrics);
}

function getMetricName(line: MetricLine): { name: string; kind?: string } {
  if (line.name.endsWith("_bucket"))
    return { name: line.name.slice(0, -7), kind: "bucket" };
  if (line.name.endsWith("_sum"))
    return { name: line.name.slice(0, -4), kind: "sum" };
  if (line.name.endsWith("_count"))
    return { name: line.name.slice(0, -6), kind: "count" };
  return { name: line.name };
}

function sortMetrics(metrics: Metrics): Metrics {
  const sortedMetrics: Metrics = {};
  for (const key of Object.keys(metrics).sort()) {
    sortedMetrics[key] = metrics[key];
  }
  return sortedMetrics;
}
