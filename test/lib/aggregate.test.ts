import { aggregate } from "../../src/lib/aggregate";
import { instruction, Line, metric } from "../../src/lib/model";

describe("aggregate", () => {
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
});
