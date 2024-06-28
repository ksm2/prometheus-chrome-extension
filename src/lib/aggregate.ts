import {
  ChildMetric,
  Histogram,
  Labels,
  Line,
  Metric,
  MetricLine,
  Metrics,
  Summary,
  Unit,
} from "./model";

export function aggregate(lines: Line[]) {
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
      if (metrics[line.name] !== undefined) {
        createMetricValue(metrics[line.name], line);
      } else {
        const { name, kind } = getMetricName(line);

        metrics[name] ??= createMetric(name);

        createMetricValue(metrics[name], line, kind);
      }
    }
  }
  return sortMetrics(metrics);
}

function pushChild(metric: Metric, child: ChildMetric) {
  if (metric.children.length > 0) {
    metric.children.push(child);
    return;
  }

  if (metric.value === undefined) {
    metric.labels = child.labels;
    metric.value = child.value;
    return;
  }

  metric.children.push({
    labels: metric.labels,
    value: metric.value,
  });
  metric.value = undefined;
  metric.children.push(child);
}

function createMetric(name: string): Metric {
  return {
    name,
    unit: deductUnitFromName(name),
    children: [],
    labels: {},
  };
}

function createMetricValue(
  metric: Metric,
  line: MetricLine,
  kind?: string,
): void {
  if (kind === undefined) {
    if (line.labels.quantile !== undefined) {
      const { quantile: _, ...labelsToLookFor } = line.labels;
      const summary = getSummary(metric, labelsToLookFor);
      summary.quantiles.push({
        quantile: line.labels.quantile,
        value: line.value,
      });
      return;
    }

    pushChild(metric, {
      labels: line.labels,
      value: { type: "literal", value: line.value },
    });
    return;
  }

  const { le: _, ...labelsToLookFor } = line.labels;
  const histogram = getHistogram(metric, labelsToLookFor);
  switch (kind) {
    case "bucket":
      histogram.buckets.push({
        le: line.labels.le,
        value: line.value,
      });
      break;
    case "sum":
      histogram.sum = line.value;
      break;
    case "count":
      histogram.count = line.value;
      break;
  }
}

function getHistogram(metric: Metric, labels: Labels): Histogram {
  for (const child of metric.children) {
    if (labelsEqual(child.labels, labels)) {
      return child.value as Histogram;
    }
  }

  if (labelsEqual(metric.labels, labels)) {
    return metric.value as Histogram;
  }

  const histogram: Histogram = {
    type: "histogram",
    buckets: [],
  };
  pushChild(metric, {
    labels,
    value: histogram,
  });
  return histogram;
}

function getSummary(metric: Metric, labels: Labels): Summary {
  for (const child of metric.children) {
    if (labelsEqual(child.labels, labels)) {
      return child.value as Summary;
    }
  }

  if (labelsEqual(metric.labels, labels)) {
    return metric.value as Summary;
  }

  const summary: Summary = {
    type: "summary",
    quantiles: [],
  };
  pushChild(metric, {
    labels,
    value: summary,
  });
  return summary;
}

function labelsEqual(a: Labels, b: Labels): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
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
