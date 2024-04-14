export const mergeObjects = (existing, incoming) => {
  const result = { ...existing };

  Object.keys(incoming).forEach((key) => {
    if (
      key in result &&
      typeof result[key] === "object" &&
      typeof incoming[key] === "object"
    ) {
      result[key] = mergeObjects(result[key], incoming[key]);
    } else if (!(key in result)) {
      result[key] = incoming[key];
    }
  });

  return result;
};
