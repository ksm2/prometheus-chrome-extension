import { InstructionLine, Metric, MetricLine, Metrics, Unit } from "./model";

export function aggregate(lines: (InstructionLine | MetricLine)[]) {
  const metrics: Metrics = {};
  for (const line of lines) {
    if (line.type === "instruction") {
      metrics[line.name] ??= createMetric(line.name);
      if (line.instr === "TYPE") {
        metrics[line.name].type = line.value;
      } else if (line.instr === "HELP") {
        metrics[line.name].help = line.value;
      }
    } else if (line.type === "metric") {
      const { name, kind } = getMetricName(line);

      metrics[name] ??= createMetric(name);
      if (metrics[name].children.length > 0) {
        metrics[name].children.push({
          labels: line.labels,
          value: line.value,
        });
      } else if (metrics[name].value === undefined) {
        metrics[name].labels = line.labels;
        metrics[name].value = line.value;
      } else {
        metrics[name].children.push({
          labels: metrics[name].labels,
          value: metrics[name].value!,
        });
        metrics[name].value = undefined;
        metrics[name].children.push({
          labels: line.labels,
          value: line.value,
        });
      }
    }
  }
  return sortMetrics(metrics);
}

function createMetric(name: string): Metric {
  return {
    name,
    unit: deductUnitFromName(name),
    children: [],
    labels: {},
  };
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

function deductUnitFromName(name: string): Unit | undefined {
  if (name.endsWith("_bytes")) return "bytes";
  if (name.endsWith("_seconds")) return "seconds";
  if (name.endsWith("_minutes")) return "minutes";
  if (name.endsWith("_millis")) return "millis";
  if (name.endsWith("_micros")) return "micros";
  if (name.endsWith("_nanos")) return "nanos";
  return undefined;
}

function sortMetrics(metrics: Metrics): Metrics {
  const sortedMetrics: Metrics = {};
  for (const key of Object.keys(metrics).sort()) {
    sortedMetrics[key] = metrics[key];
  }
  return sortedMetrics;
}
