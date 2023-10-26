/* eslint-disable global-require, @typescript-eslint/no-var-requires */
const { defaultExtractor } = require('tailwindcss/lib/lib/defaultExtractor');

/**
 * Injects the given prefix to the class string
 *
 * @param prefix - The prefix to be added
 * @param className - The class string
 *
 * @returns The prefixed class string
 */
const prefixClassName = (prefix, className) => {
  const parts = className.split(':');
  const modifiers = parts.slice(0, parts.length - 1);
  const actualClass = parts[parts.length - 1];
  let classWithPrefix = `${prefix}${actualClass}`;

  if (actualClass.startsWith('-')) {
    classWithPrefix = `-${prefix}${actualClass.slice(1, actualClass.length)}`;
  }

  if (modifiers.length === 0) {
    return classWithPrefix;
  }

  return `${modifiers.join(':')}:${classWithPrefix}`;
};

/**
 * This function injects the given prefix to all possible class elements
 * in a project. This is useful to guarantee that tailwind classes without
 * the prefix will also be taken into consideration by PurgeCSS
 *
 * For instance, let us say that we have an application A, which sets the
 * prefix `sf-`. All classes of this application must have the `sf-`
 * prefix (e.g. `sf-w-50`)
 *
 * We also have package B, with no prefix set. Classes inside this package do not
 * require any prefix (e.g. `w-100`)
 *
 * If application A uses a component from package B, tailwind will purge classes
 * that don't have the `sf-` prefix, including the classes from package B. By using
 * this extractor instead will tell tailwind to add `sf-` to classes from package B,
 * so their CSS is also included in the final build
 *
 * @example
 *
 * // On tailwind.config.js
 * module.exports = {
 *  content: {
 *    files: [...],
 *    extract: classesExtractor("ANY-PREFIX"),
 *  }
 * };
 *
 * @param prefix - The project's prefix
 */
module.exports = (prefix) => {
  if (!prefix) return defaultExtractor;

  return (content) =>
    defaultExtractor(content).map((element) =>
      element
        .replace(prefix, '')
        .split(' ')
        .map((className) => prefixClassName(prefix, className))
        .join(' ')
    );
};
