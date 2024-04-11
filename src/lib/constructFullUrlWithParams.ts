import { deserializeQuery, serializeQuery } from "./serializeQuery";

export function constructFullUrlWithParams(
  baseUrl: string,
  queryParams: Record<string, unknown>
) {
  if (typeof baseUrl !== "string") {
    throw new Error("Base URL must be a string.");
  }

  const url = new URL(baseUrl);

  const existingParams = deserializeQuery(url.search);

  const mergedParams = { ...existingParams, ...queryParams };
  const serializedParams = serializeQuery(mergedParams);

  url.search = serializedParams;

  return url.toString();
}
