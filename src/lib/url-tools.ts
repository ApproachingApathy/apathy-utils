/**
 * Appends a slash to the end of a string if one is not present.
 */
export function appendSlash(str: string): string {
  if (str.endsWith('/')) return str;
  return `${str}/`;
}

/**
 * Prepends a slash to the beginning of a string if one is not present.
 */
export function prependSlash(str: string): string {
  if (str.startsWith('/')) return str;
  return `/${str}`;
}
