type Notation = "compact" | "engineering" | "scientific" | "standard";
type NumberStyle = "decimal" | "currency" | "percent" | "unit";

const languageMap = {
  en: "en-US",
  "pt-BR": "pt-BR",
};

export const formatNumber = (
  number: number | string | bigint,
  decimals = 1,
  numberStyle: NumberStyle = "decimal",
  notation: Notation = "compact",
  lessThanThresholdToReplace = 0.001,
  language = "en"
) => {
  if (number === undefined || number === null || number === "") return "0";

  let num: number;
  if (typeof number === "bigint") {
    num = Number(number.toString());
  } else {
    num = Number(number);
  }

  if (Number.isNaN(num)) return "Invalid Number";
  if (num === 0) return "0";

  const absNum = Math.abs(num);
  if (absNum > 0 && absNum < lessThanThresholdToReplace) {
    return `< ${lessThanThresholdToReplace.toLocaleString(
      languageMap[language] || "en-US",
      {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }
    )}`;
  }

  const options: Intl.NumberFormatOptions = {
    notation,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    style: numberStyle,
  };

  if (numberStyle === "currency") {
    options.currency = "USD";
  }

  return num.toLocaleString(languageMap[language] || "en-US", options);
};

export function numberToPercent(value?: number) {
  if (value === undefined) return undefined;
  return value * 100;
}

export function percentToNumber(value: number) {
  return value / 100;
}

export function convertStringToNumberAndRoundDown(value: string) {
  const num = parseFloat(value);
  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    return BigInt(Math.floor(num));
  }
  const integerPartLength = Math.floor(Math.abs(num)).toString().length;
  const maxDecimalPlaces = Math.max(0, 15 - integerPartLength);
  return Number(num.toFixed(maxDecimalPlaces));
}
