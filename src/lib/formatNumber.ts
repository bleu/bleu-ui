type Notation = "compact" | "engineering" | "scientific" | "standard";

export const formatNumber = (
  number: number | string | bigint,
  decimals = 1,
  style = "decimal",
  notation: Notation = "compact",
  lessThanThresholdToReplace = 0.001
) => {
  if (number === 0) return "0";
  if (!number) return "0";
  if (Math.abs(Number(number)) < lessThanThresholdToReplace) {
    return `< ${lessThanThresholdToReplace.toLocaleString("en-US")}`;
  }

  return Number(number).toLocaleString("en-US", {
    notation,
    maximumFractionDigits: decimals,
    style,
  });
};

export function numberToPercent(value?: number) {
  if (!value) return undefined;
  return value * 100;
}

export function percentToNumber(value: number) {
  return value / 100;
}

export function convertStringToNumberAndRoundDown(value: string) {
  const num = parseFloat(value);
  const integerPartLength = Math.floor(num).toString().length;
  const maxDecimalPlaces = Math.max(0, 15 - integerPartLength);
  const scale = 10 ** maxDecimalPlaces;
  return Math.floor(num * scale) / scale;
}
