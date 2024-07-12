import { describe, expect } from "vitest";
import {
  formatNumber,
  numberToPercent,
  percentToNumber,
  convertStringToNumberAndRoundDown,
} from "#/lib";

describe("formatNumber", () => {
  test("handles undefined, null, and empty string", () => {
    expect(formatNumber(undefined as any)).toBe("0");
    expect(formatNumber(null as any)).toBe("0");
    expect(formatNumber("")).toBe("0");
  });

  test("handles zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  test("handles NaN", () => {
    expect(formatNumber(NaN)).toBe("Invalid Number");
  });

  test("formats numbers below threshold", () => {
    expect(formatNumber(0.0001, 3)).toBe("< 0.001");
    expect(formatNumber(0.00009, 4, "decimal", "standard", 0.0001)).toBe(
      "< 0.0001"
    );
  });

  test("formats numbers above threshold", () => {
    expect(formatNumber(1234.5678, 2)).toBe("1.23K");
    expect(formatNumber(1234.5678, 2, "decimal", "standard")).toBe("1,234.57");
  });

  test("respects decimal places", () => {
    expect(formatNumber(1.23456, 3)).toBe("1.235");
    expect(formatNumber(1.23456, 1)).toBe("1.2");
  });

  test("handles different notations", () => {
    expect(formatNumber(1234.5678, 2, "decimal", "scientific")).toBe("1.23E3");
    expect(formatNumber(1234.5678, 2, "decimal", "engineering")).toBe("1.23E3");
  });

  test("handles different number styles", () => {
    expect(formatNumber(0.1234, 2, "percent")).toBe("12.34%");
    expect(formatNumber(1.2345, 2, "currency")).toBe("$1.23");
  });

  test("handles different languages", () => {
    expect(
      formatNumber(1234.56, 2, "decimal", "standard", 0.001, "pt-BR")
    ).toBe("1.234,56");
  });

  test("handles bigint", () => {
    expect(
      formatNumber(BigInt("1234567890123456789"), 0, "decimal", "standard")
    ).toBe("1,234,567,890,123,456,800");
  });
});

describe("numberToPercent", () => {
  test("converts number to percentage", () => {
    expect(numberToPercent(0.5)).toBe(50);
    expect(numberToPercent(1)).toBe(100);
    expect(numberToPercent(0)).toBe(0);
  });

  test("handles undefined", () => {
    expect(numberToPercent(undefined)).toBeUndefined();
  });
});

describe("percentToNumber", () => {
  test("converts percentage to number", () => {
    expect(percentToNumber(50)).toBe(0.5);
    expect(percentToNumber(100)).toBe(1);
    expect(percentToNumber(0)).toBe(0);
  });
});

describe("convertStringToNumberAndRoundDown", () => {
  test("converts string to number and rounds down", () => {
    expect(convertStringToNumberAndRoundDown("123.456")).toBe(123.456);
    expect(convertStringToNumberAndRoundDown("0.1234567890123456")).toBe(
      0.12345678901235
    );
    expect(convertStringToNumberAndRoundDown("9999999999999.9")).toBe(
      9999999999999.9
    );
  });

  test("handles very small numbers", () => {
    expect(convertStringToNumberAndRoundDown("0.0000000000000001")).toBe(0.0);
  });

  test("handles very large numbers", () => {
    expect(convertStringToNumberAndRoundDown("123456789012345.6789")).toBe(
      123456789012346
    );
  });
});
