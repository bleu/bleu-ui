/**
 * Serializes an object into a query string. This function handles nested objects, arrays,
 * and primitive data types (strings, numbers, booleans). It encodes keys and values to
 * ensure a valid query string. The function throws an error if the input is not an object.
 *
 * @example
 * // Basic usage
 * const params = { name: 'John', age: 30 };
 * serializeQuery(params);
 * > 'name=John&age=30'
 *
 * @example
 * // Nested objects and arrays
 * const complexParams = {
 *   user: { name: 'John', roles: ['admin', 'user'] },
 *   active: true
 * };
 * serializeQuery(complexParams);
 * > 'user[name]=John&user[roles][]=admin&user[roles][]=user&active=true'
 *
 * @param {Object} params - The object to be serialized into a query string.
 * @param {string} [prefix=""] - A prefix used for nested objects (internal use).
 * @returns {string} - The serialized query string.
 * @throws {Error} - Throws an error if the input is not an object.
 */
export function serializeQuery(params?: object | null, prefix = ""): string {
  if (typeof params !== "object" || params === null) {
    throw new Error("Input must be an object");
  }

  return Object.entries(params)
    .reduce((acc, [key, value]) => {
      if (value == null) return acc;

      const fullKey = prefix
        ? `${prefix}[${encodeURIComponent(key)}]`
        : encodeURIComponent(key);

      if (Array.isArray(value)) {
        value.forEach((elem) => {
          acc.push(`${fullKey}[]=${encodeURIComponent(elem)}`);
        });
      } else if (typeof value === "object") {
        acc.push(serializeQuery(value, fullKey));
      } else if (
        typeof value === "boolean" ||
        typeof value === "number" ||
        typeof value === "string"
      ) {
        acc.push(`${fullKey}=${encodeURIComponent(value)}`);
      }

      return acc;
    }, [] as string[])
    .join("&");
}

/**
 * Deserializes a query string into an object. This function can handle nested parameters
 * and arrays. It uses URLSearchParams to parse the query string and reconstructs the
 * original object structure. The function throws an error if the input is not a string.
 *
 * @example
 * const queryString = 'user[name]=John&user[roles][]=admin&user[roles][]=user&active=true';
 * deserializeQuery(queryString);
 * > { user: { name: 'John', roles: ['admin', 'user'] }, active: 'true' }
 *
 * @param {string} queryString - The query string to be deserialized into an object.
 * @returns {Object} - The deserialized object.
 * @throws {Error} - Throws an error if the input is not a string.
 */
export function deserializeQuery(queryString: string): object {
  if (typeof queryString !== "string") {
    throw new Error("Query string must be a string");
  }

  const result = {};
  const params = new URLSearchParams(queryString);

  params.forEach((value, key) => {
    const path = key.split(/\[|\]/).filter(Boolean);
    let current = result;

    path.forEach((part, index) => {
      const isLast = index === path.length - 1;
      if (isLast) {
        if (current[part]) {
          if (Array.isArray(current[part])) {
            current[part].push(value);
          } else {
            current[part] = [current[part], value];
          }
        } else {
          current[part] = value;
        }
      } else if (part.endsWith("[]")) {
        const arrayKey = part.slice(0, -2);
        current[arrayKey] = current[arrayKey] || [];
        current = current[arrayKey];
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  });

  return result;
}
