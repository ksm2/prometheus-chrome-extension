import { aggregate } from "../../src/lib/aggregate";
import { instruction, Line, metric } from "../../src/lib/model";

describe("aggregate", () => {
  it("should aggregate a metric without a value", () => {
    const lines: Line[] = [
      instruction("TYPE", "empty_metric", "gauge"),
      instruction("UNIT", "empty_metric", "seconds"),
      instruction("HELP", "empty_metric", "It has no value."),
    ];
    const result = aggregate(lines);
    expect(result).toEqual({
      empty_metric: {
        name: "empty_metric",
        help: "It has no value.",
        type: "gauge",
        unit: "seconds",
        children: [],
        labels: {},
        value: undefined,
      },
    });
  });

  it("should deduct a unit from the name", () => {
    const lines: Line[] = [
      instruction("TYPE", "just_a_few_seconds", "gauge"),
      instruction("HELP", "just_a_few_seconds", "This is in seconds."),
    ];
    const result = aggregate(lines);
    expect(result).toEqual({
      just_a_few_seconds: {
        name: "just_a_few_seconds",
        help: "This is in seconds.",
        type: "gauge",
        unit: "seconds",
        children: [],
        labels: {},
        value: undefined,
      },
    });
  });

  it("should prefer a UNIT instruction over the name", () => {
    const lines: Line[] = [
      instruction("TYPE", "just_a_few_seconds", "gauge"),
      instruction("UNIT", "just_a_few_seconds", "minutes"),
      instruction("HELP", "just_a_few_seconds", "This is in minutes."),
    ];
    const result = aggregate(lines);
    expect(result).toEqual({
      just_a_few_seconds: {
        name: "just_a_few_seconds",
        help: "This is in minutes.",
        type: "gauge",
        unit: "minutes",
        children: [],
        labels: {},
        value: undefined,
      },
    });
  });

  it("should aggregate a single metric", () => {
    const lines: Line[] = [
      instruction("TYPE", "metric_name", "counter"),
      instruction("HELP", "metric_name", "It is a counter."),
      metric("metric_name", "42"),
    ];
    const result = aggregate(lines);
    expect(result).toEqual({
      metric_name: {
        name: "metric_name",
        help: "It is a counter.",
        type: "counter",
        children: [],
        labels: {},
        value: { type: "literal", value: "42" },
      },
    });
  });

  it("should aggregate a gauge ending in count", () => {
    const lines: Line[] = [
      instruction("TYPE", "open_resources_count", "gauge"),
      instruction(
        "HELP",
        "open_resources_count",
        "The number of currently open resources.",
      ),
      metric("open_resources_count", "1337"),
    ];
    const result = aggregate(lines);
    expect(result).toEqual({
      open_resources_count: {
        name: "open_resources_count",
        help: "The number of currently open resources.",
        type: "gauge",
        children: [],
        labels: {},
        value: { type: "literal", value: "1337" },
      },
    });
  });

  it("should aggregate a gauge having a quantile label", () => {
    const lines: Line[] = [
      instruction("TYPE", "not_a_summary", "gauge"),
      instruction("HELP", "not_a_summary", "I am not a summary."),
      metric("not_a_summary", "42.13", { quantile: "0.99" }),
    ];
    const result = aggregate(lines);
    expect(result).toEqual({
      not_a_summary: {
        name: "not_a_summary",
        help: "I am not a summary.",
        type: "gauge",
        children: [],
        labels: { quantile: "0.99" },
        value: { type: "literal", value: "42.13" },
      },
    });
  });
});
