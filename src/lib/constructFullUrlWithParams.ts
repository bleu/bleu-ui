import { deserializeQuery, serializeQuery } from "./serializeQuery";

export function constructFullUrlWithParams(
  pathOrUrl: string,
  queryParams: Record<string, unknown>
) {
  if (typeof pathOrUrl !== "string") {
    throw new Error("Base URL must be a string.");
  }

  const isFullUrl = /^(http|https):\/\//.test(pathOrUrl);
  const url = new URL(
    pathOrUrl,
    isFullUrl ? undefined : window.location.origin
  );

  const existingParams = deserializeQuery(url.search);

  const mergedParams = { ...existingParams, ...queryParams };
  const serializedParams = serializeQuery(mergedParams);

  url.search = serializedParams;

  return url.toString();
}
