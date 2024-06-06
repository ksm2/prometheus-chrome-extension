import { Unit } from "./model";

export function format(value: string | number, unit: Unit): string {
  let num: number;
  if (typeof value === "number") {
    num = value;
  } else {
    num = parseFloat(value);
  }

  if (Number.isNaN(num)) {
    return value.toString();
  }

  switch (unit) {
    case "bytes":
      return formatBytes(num);
    case "minutes":
      return formatMinutes(num);
    case "seconds":
      return formatSeconds(num);
    case "millis":
      return formatMillis(num);
    case "micros":
      return formatMicros(num);
    case "nanos":
      return formatNanos(num);
    default:
      return value.toString();
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return bytes.toFixed(0) + " B";
  }
  if (bytes < 1024 * 1024) {
    return toFixedMax(bytes / 1024, 2) + " KB";
  }
  if (bytes < 1024 * 1024 * 1024) {
    return toFixedMax(bytes / (1024 * 1024), 2) + " MB";
  }
  return toFixedMax(bytes / (1024 * 1024 * 1024), 2) + " GB";
}

function formatNanos(nanos: number): string {
  if (nanos < 1_000) {
    return nanos.toFixed(0) + " ns";
  }
  return formatMicros(nanos / 1_000);
}

function formatMicros(micros: number): string {
  if (micros < 1) {
    return formatNanos(micros * 1_000);
  }
  if (micros < 1_000) {
    return toFixedMax(micros, 3) + " µs";
  }
  return formatMillis(micros / 1_000);
}

function formatMillis(millis: number): string {
  if (millis < 1) {
    return formatMicros(millis * 1_000);
  }
  if (millis < 1_000) {
    return toFixedMax(millis, 3) + " ms";
  }
  return formatSeconds(millis / 1_000);
}

function formatSeconds(seconds: number): string {
  if (seconds < 1) {
    return formatMillis(seconds * 1_000);
  }
  if (seconds < 60) {
    return toFixedMax(seconds, 3) + " sec";
  }
  return formatMinutes(seconds / 60);
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return minutes.toFixed(0) + " min";
  }
  return Math.floor(minutes / 60) + " h " + (minutes % 60) + " min";
}

function toFixedMax(num: number, maxDec: number): string {
  const str = num.toFixed(maxDec);
  return str.replace(/\.?0+$/, "");
}
