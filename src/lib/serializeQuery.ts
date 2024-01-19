/* eslint-disable no-param-reassign */
/**
 * This function takes an object containing parameters and converts it into a query string.
 * It follows the Rails pattern for nested query parameters.
 *
 * @example
 * // Basic usage
 * const params = { name: 'John', age: 30 };
 * serializeQuery(params);
 * // Returns 'name=John&age=30'
 *
 * @example
 * // Nested parameters
 * const nestedParams = { user: { name: 'John', age: 30 } };
 * serializeQuery(nestedParams);
 * // Returns 'user[name]=John&user[age]=30'
 */

export function serializeQuery(params, prefix) {
  const query = Object.keys(params).map((key) => {
    const value = params[key];

    if (params.constructor === Array) key = `${prefix}[]`;
    else if (params.constructor === Object)
      key = prefix ? `${prefix}[${key}]` : key;

    if (typeof value === "object") return serializeQuery(value, key);
    return `${key}=${encodeURIComponent(value)}`;
  });

  return [...[].concat(...query)].join("&");
}
