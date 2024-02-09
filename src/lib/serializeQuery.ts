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
  const query = serializeParamsToQueryStrings(params, prefix);
  return [...[].concat(...query)].join("&");
}

/**
 * This function takes an object containing parameters and converts it into a query string.
 * It follows the Rails pattern for nested query parameters.
 * @example
 * const params = {
    "columnFilters": {
        "is_general_thesis": [
            "false"
        ]
    },
    "pageIndex": 0,
    "pageSize": 10
  };
 * serializeQueryObject(params);
 * // Returns {
    "columnFilters[is_general_thesis][]": "false",
    "pageIndex": "0",
    "pageSize": "10"
 * }
 */
export function serializeQueryObject(params, prefix = undefined) {
  const query = serializeParamsToQueryStrings(params, prefix);
  return parseQueryStrings(query.filter((item) => item !== ""));
}

/**
 * This function takes a query string and converts it into an object.
 * It follows the Rails pattern for nested query parameters.
 * @example
 * const nestedQueryString = 'user[name]=John&user[age]=30';
 * deserializeQuery(nestedQueryString);
 * // Returns { user: { name: 'John', age: 30 } }
 */
export function deserializeQuery(paramsString) {
  const arr = decodeURIComponent(paramsString.replace(/\+/g, "%20")).split("&");
  const result = {};

  arr.forEach((item) => {
    // eslint-disable-next-line prefer-const
    let [path, value] = item.split("=");

    // eslint-disable-next-line no-useless-escape
    const pathParts = path.split(/[\[\]]/).filter((p) => p);
    // eslint-disable-next-line array-callback-return, consistent-return
    pathParts.reduce((acc, key, index) => {
      if (index === pathParts.length - 1) {
        if (key in acc && Array.isArray(acc[key])) {
          acc[key].push(value);
        } else if (key in acc) {
          acc[key] = [acc[key], value];
        } else {
          acc[key] = value;
        }
      } else {
        if (!(key in acc)) {
          // eslint-disable-next-line no-restricted-globals
          acc[key] = isNaN(Number(pathParts[index + 1])) ? {} : [];
        }
        return acc[key];
      }
    }, result);
  });

  return result;
}

function serializeParamsToQueryStrings(params, prefix = undefined) {
  const query = Object.keys(params).map((key) => {
    const value = params[key];

    if (params.constructor === Array) key = `${prefix}[]`;
    else if (params.constructor === Object)
      key = prefix ? `${prefix}[${key}]` : key;

    if (typeof value === "object") return serializeQuery(value, key);
    return `${key}=${encodeURIComponent(value)}`;
  });

  return query;
}

function parseQueryStrings(queryStrings) {
  const result = {};
  queryStrings.forEach((queryString) => {
    const firstEqualIndex = queryString.indexOf("=");
    const key = queryString.substring(0, firstEqualIndex);
    const value = queryString.substring(firstEqualIndex + 1);

    // Handle the case where the key already exists in the result object
    if (result[key]) {
      // If the key already exists and is not an array, convert it to an array
      if (!Array.isArray(result[key])) {
        result[key] = [result[key]];
      }
      result[key].push(decodeURIComponent(value));
    } else {
      result[key] = decodeURIComponent(value);
    }
  });
  return result;
}
