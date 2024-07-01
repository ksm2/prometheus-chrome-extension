import {
  ChildMetric,
  Histogram,
  InstructionLine,
  Labels,
  Line,
  Metric,
  MetricLine,
  Metrics,
  MetricType,
  Summary,
  Unit,
} from "./model";

export function aggregate(lines: Line[]): Metrics {
  const metrics: Metrics = {};
  for (const line of lines) {
    if (line.type === "instruction") {
      aggregateInstruction(metrics, line);
    } else if (line.type === "metric") {
      aggregateMetric(metrics, line);
    }
  }
  return sortMetrics(metrics);
}

function aggregateInstruction(metrics: Metrics, line: InstructionLine) {
  metrics[line.name] ??= createMetric(line.name);
  if (line.instr === "TYPE") {
    metrics[line.name].type = parseMetricType(line.value);
  } else if (line.instr === "HELP") {
    metrics[line.name].help = line.value;
  } else if (line.instr === "UNIT") {
    metrics[line.name].unit = parseUnit(line.value);
  }
}

function aggregateMetric(metrics: Metrics, line: MetricLine) {
  if (metrics[line.name] !== undefined) {
    createMetricValue(metrics[line.name], line);
    return;
  }

  const index = line.name.lastIndexOf("_");
  if (index !== -1) {
    const name = line.name.slice(0, index);
    const suffix = line.name.slice(index + 1);
    if (metrics[name] !== undefined) {
      createMetricValue(metrics[name], line, suffix);
    }
  }
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
    type: "unknown",
    unit: deductUnitFromName(name),
    children: [],
    labels: {},
  };
}

function parseMetricType(type: string): MetricType {
  const lowerCase = type.toLowerCase();
  switch (lowerCase) {
    case "counter":
    case "gauge":
    case "histogram":
    case "gaugehistogram":
    case "stateset":
    case "info":
    case "summary":
      return lowerCase;
    default:
      return "unknown";
  }
}

function createMetricValue(
  metric: Metric,
  line: MetricLine,
  kind?: string,
): void {
  switch (metric.type) {
    case "info":
      createInfoValue(metric, line, kind);
      break;
    case "histogram":
      createHistogramValue(metric, line, kind);
      break;
    case "summary":
      createSummaryValue(metric, line, kind);
      break;
    default:
      createLiteralValue(metric, line);
      break;
  }
}

function createLiteralValue(metric: Metric, line: MetricLine) {
  pushChild(metric, {
    labels: line.labels,
    value: { type: "literal", value: line.value },
  });
}

function createInfoValue(metric: Metric, line: MetricLine, kind?: string) {
  if (kind === "info" || kind === undefined) {
    pushChild(metric, {
      labels: line.labels,
      value: { type: "info" },
    });
  }
}

function createHistogramValue(metric: Metric, line: MetricLine, kind?: string) {
  const { le: _, ...labelsToLookFor } = line.labels;
  const histogram = getHistogram(metric, labelsToLookFor);
  if (histogram === undefined) return;

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

function createSummaryValue(metric: Metric, line: MetricLine, kind?: string) {
  const { quantile: _, ...labelsToLookFor } = line.labels;
  const summary = getSummary(metric, labelsToLookFor);
  if (summary === undefined) return;

  switch (kind) {
    case "sum":
      summary.sum = line.value;
      break;
    case "count":
      summary.count = line.value;
      break;
    case undefined:
      summary.quantiles.push({
        quantile: line.labels.quantile,
        value: line.value,
      });
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

function getSummary(metric: Metric, labels: Labels): Summary | undefined {
  for (const child of metric.children) {
    if (labelsEqual(child.labels, labels)) {
      return child.value as Summary | undefined;
    }
  }

  if (labelsEqual(metric.labels, labels)) {
    return metric.value as Summary | undefined;
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

function deductUnitFromName(name: string): Unit | undefined {
  const last = lastSegment(name);
  return parseUnit(last);
}

function lastSegment(name: string): string {
  const index = name.lastIndexOf("_");
  if (index === -1) return name;
  return name.slice(index + 1);
}

function parseUnit(unit: string): Unit | undefined {
  switch (unit) {
    case "minutes":
    case "seconds":
    case "millis":
    case "micros":
    case "nanos":
    case "bytes":
      return unit;
    default:
      return undefined;
  }
}

function sortMetrics(metrics: Metrics): Metrics {
  const sortedMetrics: Metrics = {};
  for (const key of Object.keys(metrics).sort()) {
    sortedMetrics[key] = metrics[key];
  }
  return sortedMetrics;
}
