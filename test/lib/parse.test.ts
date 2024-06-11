import { parse } from "../../src/lib/parse";

describe("parse", () => {
  it("should parse a line with an instruction", () => {
    const line = "# instruction name value";
    const result = parse(line);
    expect(result).toEqual([
      {
        type: "instruction",
        instr: "instruction",
        name: "name",
        value: "value",
      },
    ]);
  });

  it("should parse a line with an integer metric and no labels", () => {
    const line = "metric_name 42";
    const result = parse(line);
    expect(result).toEqual([
      {
        type: "metric",
        name: "metric_name",
        labels: {},
        value: "42",
      },
    ]);
  });

  it("should parse a line with a float metric and no labels", () => {
    const line = "metric_name 42.42";
    const result = parse(line);
    expect(result).toEqual([
      {
        type: "metric",
        name: "metric_name",
        labels: {},
        value: "42.42",
      },
    ]);
  });

  it("should parse a line with a float metric and labels", () => {
    const line = 'metric_name{key="value"} 42.42';
    const result = parse(line);
    expect(result).toEqual([
      {
        type: "metric",
        name: "metric_name",
        labels: { key: "value" },
        value: "42.42",
      },
    ]);
  });

  it("should parse a line with a timestamp", () => {
    const line = "metric_name 42 1612345678";
    const result = parse(line);
    expect(result).toEqual([
      {
        type: "metric",
        name: "metric_name",
        labels: {},
        value: "42",
        timestamp: 1612345678,
      },
    ]);
  });

  it("should parse a line with exponential notation", () => {
    const line = "metric_name 4.2e-3";
    const result = parse(line);
    expect(result).toEqual([
      {
        type: "metric",
        name: "metric_name",
        labels: {},
        value: "4.2e-3",
      },
    ]);
  });

  it("should parse a line with NaN", () => {
    const line = "metric_name NaN";
    const result = parse(line);
    expect(result).toEqual([
      {
        type: "metric",
        name: "metric_name",
        labels: {},
        value: "NaN",
      },
    ]);
  });

  it("should parse a line with +Inf", () => {
    const line = "metric_name +Inf";
    const result = parse(line);
    expect(result).toEqual([
      {
        type: "metric",
        name: "metric_name",
        labels: {},
        value: "+Inf",
      },
    ]);
  });

  it("should parse a line with -Inf", () => {
    const line = "metric_name -Inf";
    const result = parse(line);
    expect(result).toEqual([
      {
        type: "metric",
        name: "metric_name",
        labels: {},
        value: "-Inf",
      },
    ]);
  });
});
