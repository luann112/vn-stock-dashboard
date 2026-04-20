import { describe, expect, test } from "vitest";
import { cn, formatPrice, formatVolume, formatPercent } from "./utils";

describe("cn", () => {
  test("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  test("resolves Tailwind conflicts by keeping last", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  test("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  test("returns empty string for no input", () => {
    expect(cn()).toBe("");
  });
});

describe("formatPrice", () => {
  test("converts VND raw to thousands with 2 decimals", () => {
    expect(formatPrice(85000)).toBe("85.00");
  });

  test("handles sub-thousand prices", () => {
    expect(formatPrice(500)).toBe("0.50");
  });

  test("handles zero", () => {
    expect(formatPrice(0)).toBe("0.00");
  });

  test("handles large prices", () => {
    expect(formatPrice(150200)).toBe("150.20");
  });
});

describe("formatVolume", () => {
  test("formats millions with 1 decimal", () => {
    expect(formatVolume(2_500_000)).toBe("2.5M");
  });

  test("formats thousands with no decimal", () => {
    expect(formatVolume(45_000)).toBe("45K");
  });

  test("formats exact million boundary", () => {
    expect(formatVolume(1_000_000)).toBe("1.0M");
  });

  test("formats exact thousand boundary", () => {
    expect(formatVolume(1_000)).toBe("1K");
  });

  test("formats sub-thousand as plain number", () => {
    expect(formatVolume(999)).toBe("999");
  });

  test("formats zero", () => {
    expect(formatVolume(0)).toBe("0");
  });
});

describe("formatPercent", () => {
  test("adds + prefix for positive values", () => {
    expect(formatPercent(2.5)).toBe("+2.50%");
  });

  test("keeps - prefix for negative values", () => {
    expect(formatPercent(-1.23)).toBe("-1.23%");
  });

  test("adds + prefix for zero", () => {
    expect(formatPercent(0)).toBe("+0.00%");
  });

  test("handles small decimals", () => {
    expect(formatPercent(0.001)).toBe("+0.00%");
  });
});
