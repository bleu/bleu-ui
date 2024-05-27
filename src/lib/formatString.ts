export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}
